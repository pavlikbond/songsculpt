import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
//handler for getting lyrics from musixmatch api using fetch
export async function GET(req: NextRequest) {
  console.log("hello world from the route GET function");
  const searchParams = req.nextUrl.searchParams;
  let song = searchParams.get("song") as string;
  let artist = searchParams.get("artist") as string;
  //pull out query params
  console.log(song, artist);
  const apiKey = "de62b0ba235444f95dda62c84a98d0c7";
  const apiUrl = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${encodeURIComponent(
    song
  )}&q_artist=${encodeURIComponent(artist)}&apikey=${apiKey}`;
  console.log(artist);
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Assuming the structure of the response, you can access the lyrics
    const lyrics = data.message.body.lyrics.lyrics_body;
    console.log(lyrics);
    //return 200 response
    return NextResponse.json({ lyrics: lyrics }, { status: 200 });
    //return NextResponse.json({ message: "Hello world" }, { status: 200 });
  } catch (error) {
    console.error("Error fetching song lyrics:", error);
    //return 500 response
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
