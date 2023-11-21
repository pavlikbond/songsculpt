import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import axios from "axios";
import extractLyrics from "./extractLyrics";
import generateppt from "./presentation";
import getMostRelevantResult from "./getMostRelevantResult";
import getLyricsFromStands4 from "./stands4";

const BASE_URL = "https://api.genius.com";
const ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;

//handler for getting lyrics from musixmatch api using fetch
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  let song = searchParams.get("song") as string;
  let artist = searchParams.get("artist") as string;
  //pull out query params
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
    if (relevantHit) {
      //   const songId = relevantHit.result.id;
      //   // Step 2: Get lyrics for the song
      //   const lyricsUrl = `${BASE_URL}/songs/${songId}`;
      //   const lyricsResponse = await axios.get(lyricsUrl, {
      //     headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      //   });
      //   let url = lyricsResponse.data.response.song.url;
      //   lyrics = await extractLyrics(url);
    } else {
      lyrics = await getLyricsFromStands4(song, artist);
    }

    let pres = generateppt(lyrics!, song, artist);

    try {
      const data: any = await pres.stream();
      const exportName = "presentation.pptx";

      // Create a new NextResponse object
      const response = new NextResponse(data, {
        // Set the status code to 200
        status: 200,
        // Set the headers for the response
        headers: {
          "Content-disposition": `attachment; filename=${exportName}`,
          "Content-Length": data.length.toString(),
        },
      });

      // Return the response
      return response;
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    console.error("Error fetching data from Genius API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
