import pptxgen from "pptxgenjs";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

//handler for getting lyrics from musixmatch api using fetch
export async function GET(req: NextRequest, res: any) {
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
    let lyrics = data.message.body.lyrics.lyrics_body;
    console.log(lyrics);

    let pres = new pptxgen();
    //add title slide with song name and artist, center the title inside of the slide and make it big
    let slide = pres.addSlide();
    let textboxText = `${song} by ${artist}`;
    slide.addText(textboxText, {
      y: "30%",
      w: "100%",
      h: "20%",
      fontSize: 36,
      color: "363636",
      align: "center",
      wrap: true,
    });

    lyrics = lyrics.split("\n\n").slice(0, 3);
    // 2. Add a Slide
    for (let lyric of lyrics) {
      let slide = pres.addSlide();
      let textboxText = lyric;
      slide.addText(textboxText, {
        x: 0,
        y: 0,
        w: "100%",
        h: "100%",
        fontSize: 18,
        color: "363636",
        align: "center",
        autoFit: true,
      });
    }
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

    //return 200 response
    //return NextResponse.json({ lyrics: lyrics }, { status: 200 });
    //return NextResponse.json({ message: "Hello world" }, { status: 200 });
  } catch (error) {
    console.error("Error fetching song lyrics:", error);
    //return 500 response
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
