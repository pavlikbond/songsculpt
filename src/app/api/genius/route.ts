import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import axios from "axios";
import extractLyrics from "./extractLyrics";
import getMostRelevantResult from "./getMostRelevantResult";

const BASE_URL = "https://api.genius.com";
const ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;

//handler for getting lyrics from musixmatch api using fetch
export async function PUT(req: NextRequest) {
  console.log("PUT /api/genius");
  //get song and artist from request body
  const body = await req.json();
  const { song, artist } = body;

  console.log(song, artist);
  try {
    // Step 1: Search for the song
    const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(`${artist} ${song}`)}`;
    const searchResponse = await axios.get(searchUrl, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });

    //console.log(searchResponse.data.response.hits);
    //const songId = searchResponse.data.response.hits[1].result.id;
    let relevantHit = getMostRelevantResult(searchResponse.data.response.hits, song, artist);
    let lyrics; //: { sectionTitle: string; lyrics: string }[];
    let url = "";
    let lyricsString = "";
    if (relevantHit) {
      const songId = relevantHit.result?.id;
      // Step 2: Get lyrics for the song
      const lyricsUrl = `${BASE_URL}/songs/${songId}`;
      const lyricsResponse = await axios.get(lyricsUrl, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });
      url = lyricsResponse.data.response.song.url;
      let extractedResponse = await extractLyrics(url);
      let lyricsArray = extractedResponse?.lyricsArray;
      lyricsString = extractedResponse?.lyrics || "";
      lyrics = lyricsArray;
    } else {
      throw new Error("No results found");
    }
    //log out all the variables

    return NextResponse.json({ lyrics: lyrics }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching data from Genius API:", error);
    //return message from thrown error
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 404 });
  }
}
