import axios from "axios";
import * as cheerio from "cheerio";

/**
 * @param {string} url - Genius URL
 */
export default async function extractLyrics(url) {
  try {
    const { data } = await axios.get(url);
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
    console.log(lyrics);
    lyrics = lyrics.trim();
    let lyricsArray = processLyrics(lyrics);
    console.log(lyricsArray);
    return lyricsArray || null;
  } catch (error) {
    throw error;
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
