import axios from "axios";
import * as cheerio from "cheerio";

/**
 * @param {string} url - Genius URL
 */
export default async function extractLyrics(url) {
  const maxRetries = 3; // Define the maximum number of retries
  let retries = 0; // Initialize the retry count

  // Headers to mimic a real browser and prevent bot detection
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Referer: "https://genius.com/",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
  };

  // Create axios instance to maintain cookies across requests
  const axiosInstance = axios.create({
    timeout: 15000, // 15 second timeout
    validateStatus: function (status) {
      return status < 500; // Don't throw on 4xx errors, we'll handle them
    },
    headers,
    withCredentials: true, // Enable cookies
  });

  // Warm-up: Make a request to Genius homepage first to establish session/cookies
  // This helps bypass bot detection on the first request
  try {
    console.log("Making warm-up request to Genius homepage...");
    await axiosInstance.get("https://genius.com/", {
      headers: {
        ...headers,
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
      },
    });
    // Small delay after warm-up
    await new Promise((resolve) => setTimeout(resolve, 200));
  } catch (warmUpError) {
    // Ignore warm-up errors, continue anyway
    console.log("Warm-up request failed, continuing anyway:", warmUpError.message);
  }

  while (retries < maxRetries) {
    try {
      // Use the axios instance to maintain cookies from warm-up
      const response = await axiosInstance.get(url, {
        headers: {
          ...headers,
          Referer: "https://genius.com/",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "same-origin",
        },
      });
      const { data, status } = response;

      // Check if we got a non-200 status
      if (status !== 200) {
        // Create an error that preserves the response information
        const statusText =
          status === 403 ? "Forbidden" : status === 429 ? "Rate Limited" : status === 404 ? "Not Found" : "Error";
        const error = new Error(`HTTP ${status}: ${statusText}`);
        // Attach response details to the error so route.ts can access them
        error.response = { status, statusText: response.statusText || statusText, data };
        error.config = { url };
        error.code =
          status === 403 ? "FORBIDDEN" : status === 429 ? "RATE_LIMIT" : status === 404 ? "NOT_FOUND" : "HTTP_ERROR";
        throw error;
      }

      const $ = cheerio.load(data);
      let lyrics = $('div[class="lyrics"]').text().trim();

      if (!lyrics) {
        lyrics = "";
        $('div[class^="Lyrics__Container"]').each((i, elem) => {
          if (elem && $(elem).text().length !== 0) {
            const snippet = $(elem)
              .html()
              .replace(/<br>/g, "\n")
              .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");

            lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
          }
        });
      }

      lyrics = lyrics.trim();
      let lyricsArray = processLyrics(lyrics);
      console.log(`Successfully extracted lyrics (${lyricsArray.length} sections)`);

      // Always return object, never null
      return { lyricsArray, lyrics };
    } catch (error) {
      const errorDetails = {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
      };

      console.error(`Attempt ${retries + 1}/${maxRetries} failed:`, errorDetails);

      retries++;

      // If this was the last attempt, throw the error
      if (retries === maxRetries) {
        throw error;
      }

      // Add exponential backoff delay before retrying (500ms, 1000ms, 2000ms)
      // Longer delays help with bot detection
      const delayMs = 500 * Math.pow(2, retries - 1);
      console.log(`Retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

function processLyrics(lyricsString) {
  const sections = lyricsString.split("\n\n");

  const lyricsArray = sections.map((section) => {
    let sectionTitle = null;
    let lyrics = section.trim();

    // Check if the section starts with a known keyword
    const keywordMatch = section.match(/^([A-Z]+\s\d*)/);
    if (keywordMatch) {
      sectionTitle = keywordMatch[1].replace(/\n/g, ""); // Remove newline characters
      lyrics = section.replace(keywordMatch[0], "").trim();
    } else {
      // Check if the section has square brackets
      const bracketMatch = section.match(/\[(.*?)\]/);
      if (bracketMatch) {
        sectionTitle = bracketMatch[1].replace(/\n/g, ""); // Remove newline characters
        lyrics = section.replace(/\[(.*?)\]/, "").trim();
      }
    }

    return {
      sectionTitle,
      lyrics,
    };
  });

  return lyricsArray;
}
