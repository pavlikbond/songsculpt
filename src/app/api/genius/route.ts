import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import axios from "axios";
import extractLyrics from "./extractLyrics";
import getMostRelevantResult from "./getMostRelevantResult";
import { GeniusSearchHit } from "@/types";

const BASE_URL = "https://api.genius.com";
const ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;

//handler for getting lyrics from musixmatch api using fetch
export async function PUT(req: NextRequest) {
  console.log("PUT /api/genius");

  // Validate that the access token exists
  if (!ACCESS_TOKEN) {
    console.error("GENIUS_ACCESS_TOKEN is not set");
    return NextResponse.json(
      {
        error: "CONFIGURATION_ERROR",
        message: "Server configuration error. Please try again.",
      },
      { status: 500 }
    );
  }

  //get song and artist from request body
  const body = await req.json();
  const { song, artist }: { song: string; artist?: string } = body;

  console.log(song, artist);
  try {
    // Step 1: Search for the song
    const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(`${song}`)}`;
    const searchResponse = await axios.get(searchUrl, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });

    //console.log(searchResponse.data.response.hits);
    //const songId = searchResponse.data.response.hits[1].result.id;
    const hits: GeniusSearchHit[] = searchResponse.data.response.hits;

    // Check if Genius returned no results
    if (!hits || hits.length === 0) {
      return NextResponse.json(
        {
          error: "NO_RESULTS",
          message: "No results found on Genius.com. Please try a different song name or artist.",
        },
        { status: 404 }
      );
    }

    let relevantHit = getMostRelevantResult(hits, song, artist || "");
    let lyrics; //: { sectionTitle: string; lyrics: string }[];
    let url = "";
    let lyricsString = "";

    if (!relevantHit) {
      return NextResponse.json(
        {
          error: "NO_RELEVANT_RESULTS",
          message: "No relevant results found on Genius.com. Please try a different song name or artist.",
        },
        { status: 404 }
      );
    }

    const songId = relevantHit.result?.id;
    // Step 2: Get lyrics for the song
    const lyricsUrl = `${BASE_URL}/songs/${songId}`;
    const lyricsResponse = await axios.get(lyricsUrl, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });
    url = lyricsResponse.data.response.song.url;

    // Step 3: Extract lyrics from the Genius page
    let extractedResponse;
    try {
      extractedResponse = await extractLyrics(url);
    } catch (extractError: any) {
      // Log detailed error information for debugging
      console.error("Error extracting lyrics from Genius:", {
        message: extractError.message,
        code: extractError.code,
        status: extractError.response?.status,
        statusText: extractError.response?.statusText,
        url: extractError.config?.url,
        stack: extractError.stack,
      });

      // Handle specific error types
      // Check both response.status and error.message for status codes (since we attach response to custom errors
      const status =
        extractError.response?.status ||
        (extractError.message?.match(/HTTP (\d+)/)?.[1]
          ? parseInt(extractError.message.match(/HTTP (\d+)/)[1])
          : undefined);
      const errorCode = extractError.code;

      // Handle 403 Forbidden (bot detection/blocked)
      if (status === 403) {
        return NextResponse.json(
          {
            error: "LYRICS_EXTRACTION_FAILED",
            message: "Access to the Genius page was denied. Please try again in a moment.",
          },
          { status: 403 }
        );
      }

      // Handle 429 Rate Limit
      if (status === 429) {
        return NextResponse.json(
          {
            error: "LYRICS_EXTRACTION_FAILED",
            message: "Too many requests. Please wait a moment and try again.",
          },
          { status: 429 }
        );
      }

      // Handle timeout errors
      if (errorCode === "ECONNABORTED" || errorCode === "ETIMEDOUT" || extractError.message?.includes("timeout")) {
        return NextResponse.json(
          {
            error: "LYRICS_EXTRACTION_FAILED",
            message: "Request timed out. Please try again.",
          },
          { status: 504 }
        );
      }

      // Handle network errors
      if (errorCode === "ECONNREFUSED" || errorCode === "ENOTFOUND") {
        return NextResponse.json(
          {
            error: "LYRICS_EXTRACTION_FAILED",
            message: "Network error. Please check your connection and try again.",
          },
          { status: 503 }
        );
      }

      // Handle 404 Not Found
      if (status === 404) {
        return NextResponse.json(
          {
            error: "LYRICS_EXTRACTION_FAILED",
            message: "The Genius page was not found. The song page may not be available.",
          },
          { status: 404 }
        );
      }

      // Generic fallback for other errors
      return NextResponse.json(
        {
          error: "LYRICS_EXTRACTION_FAILED",
          message: "Failed to extract lyrics from Genius.com. Please try again.",
        },
        { status: 500 }
      );
    }

    let lyricsArray = extractedResponse?.lyricsArray;
    lyricsString = extractedResponse?.lyrics || "";

    // Check if lyrics were actually extracted
    if (!lyricsArray || lyricsArray.length === 0 || !lyricsString || lyricsString.trim().length === 0) {
      return NextResponse.json(
        {
          error: "NO_LYRICS_FOUND",
          message: "No lyrics found for this song on Genius.com.",
        },
        { status: 404 }
      );
    }

    lyrics = lyricsArray;
    //log out all the variables

    return NextResponse.json({ lyrics: lyrics }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching data from Genius API:", error);

    // Handle 401 Unauthorized errors (missing/invalid token)
    if (error.response?.status === 401) {
      console.error("Genius API authentication failed - token may be missing or invalid");
      return NextResponse.json(
        {
          error: "AUTHENTICATION_ERROR",
          message: "Server configuration error. Please try again.",
        },
        { status: 500 }
      );
    }

    // If error already has a specific message from our code above, return it
    if (error.response?.data?.error && error.response?.data?.message) {
      return NextResponse.json(error.response.data, {
        status: error.response.status || 404,
      });
    }

    // Handle network/server errors - keep generic for these
    const isNetworkError = error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT" || error.code === "ENOTFOUND";
    const isServerError = error.response?.status >= 500;

    if (isNetworkError || isServerError) {
      return NextResponse.json(
        {
          error: isNetworkError ? "NETWORK_ERROR" : "SERVER_ERROR",
          message: "Something went wrong. Please try again.",
        },
        { status: isServerError ? error.response.status : 500 }
      );
    }

    // Generic fallback
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
