import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import axios from "axios";
import { Client } from "genius-lyrics";
import getMostRelevantResult from "./getMostRelevantResult";
import { GeniusSearchHit, Lyrics } from "@/types";
import { processLyrics } from "@/lib/utils";

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
    const url = relevantHit.result?.url;

    // Step 2: Use genius-lyrics package to get lyrics
    // This package handles scraping with proper headers and bypasses Cloudflare
    let lyricsString = "";
    let lyricsArray: Lyrics = [];

    try {
      // Initialize the Genius client with access token
      const client = new Client(ACCESS_TOKEN);

      // Search for the song using the package
      const searchQuery = artist ? `${song} ${artist}` : song;
      console.log(`Searching for song with genius-lyrics package: ${searchQuery}`);
      const searches = await client.songs.search(searchQuery);

      if (!searches || searches.length === 0) {
        return NextResponse.json(
          {
            error: "NO_SONG_FOUND",
            message: "Could not find the song using genius-lyrics package.",
          },
          { status: 404 }
        );
      }

      // Try to find the matching song by ID or URL, otherwise use first result
      let songObj = searches.find((s: any) => s.id === songId || s.url === url);
      if (!songObj) {
        songObj = searches[0];
        console.log(`Using first search result: ${songObj.title} by ${songObj.artist.name}`);
      } else {
        console.log(`Found matching song: ${songObj.title} by ${songObj.artist.name}`);
      }

      // Get lyrics from the song object
      console.log("Fetching lyrics using genius-lyrics package...");
      lyricsString = await songObj.lyrics();
      console.log({ lyricsString });

      // Process lyrics into array format
      lyricsArray = processLyrics(lyricsString);

      console.log(`Successfully extracted ${lyricsArray.length} lyric sections`);
    } catch (lyricsError: any) {
      console.error("Error fetching lyrics with genius-lyrics package:", {
        message: lyricsError.message,
        name: lyricsError.name,
        stack: lyricsError.stack,
      });

      return NextResponse.json(
        {
          error: "LYRICS_EXTRACTION_FAILED",
          message: "Failed to extract lyrics. Please try again.",
        },
        { status: 500 }
      );
    }

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

    return NextResponse.json({ lyrics: lyricsArray }, { status: 200 });
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
