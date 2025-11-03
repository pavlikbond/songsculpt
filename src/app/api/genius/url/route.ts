import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import extractLyrics from "../extractLyrics";

/**
 * Validates if a URL is from Genius.com
 */
function isValidGeniusUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Check if the hostname is genius.com (with or without www)
    const hostname = urlObj.hostname.toLowerCase();
    return hostname === "genius.com" || hostname === "www.genius.com";
  } catch (error) {
    return false;
  }
}

/**
 * Extracts song and artist name from Genius URL for filename purposes
 */
function extractSongInfoFromUrl(url: string): { song?: string; artist?: string } {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);

    // Genius URLs typically follow pattern: /artists/[artist]/[song]
    // or just /[song] or /[artist]-[song]
    if (pathParts.length >= 2 && pathParts[0] === "artists") {
      return {
        artist: decodeURIComponent(pathParts[1].replace(/-/g, " ")),
        song: decodeURIComponent(pathParts.slice(2).join(" ").replace(/-/g, " ")),
      };
    } else if (pathParts.length >= 1) {
      // Last part is usually the song title
      const lastPart = pathParts[pathParts.length - 1];
      const decoded = decodeURIComponent(lastPart.replace(/-/g, " "));
      return {
        song: decoded,
      };
    }
  } catch (error) {
    console.error("Error extracting song info from URL:", error);
  }

  return {};
}

// Handler for extracting lyrics from a Genius URL
export async function POST(req: NextRequest) {
  console.log("POST /api/genius/url");

  try {
    const body = await req.json();
    const { url }: { url: string } = body;

    // Validate URL is provided
    if (!url || typeof url !== "string" || url.trim().length === 0) {
      return NextResponse.json(
        {
          error: "INVALID_URL",
          message: "Please provide a valid Genius.com URL.",
        },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();

    // Validate that it's a Genius URL
    if (!isValidGeniusUrl(trimmedUrl)) {
      return NextResponse.json(
        {
          error: "INVALID_GENIUS_URL",
          message: "The URL must be from Genius.com. Please paste a valid Genius.com song URL.",
        },
        { status: 400 }
      );
    }

    // Extract lyrics from the Genius page
    let extractedResponse;
    try {
      extractedResponse = await extractLyrics(trimmedUrl);
    } catch (extractError: any) {
      console.error("Error extracting lyrics:", extractError);

      // Check if it's a network error
      if (
        extractError.code === "ECONNREFUSED" ||
        extractError.code === "ETIMEDOUT" ||
        extractError.code === "ENOTFOUND"
      ) {
        return NextResponse.json(
          {
            error: "NETWORK_ERROR",
            message: "Network error. Please check your internet connection and try again.",
          },
          { status: 500 }
        );
      }

      // Check if it's a 404 or access denied
      if (extractError.response?.status === 404) {
        return NextResponse.json(
          {
            error: "PAGE_NOT_FOUND",
            message: "The Genius page was not found. Please check the URL and try again.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: "LYRICS_EXTRACTION_FAILED",
          message: "Failed to extract lyrics from Genius.com. The song page may not be available or accessible.",
        },
        { status: 404 }
      );
    }

    let lyricsArray = extractedResponse?.lyricsArray;
    const lyricsString = extractedResponse?.lyrics || "";

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

    // Extract song info from URL for potential use
    const songInfo = extractSongInfoFromUrl(trimmedUrl);

    return NextResponse.json(
      {
        lyrics: lyricsArray,
        url: trimmedUrl,
        ...songInfo,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing Genius URL request:", error);

    // Handle network/server errors
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
