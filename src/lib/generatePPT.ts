import pptxgen from "pptxgenjs";
import { Settings } from "@/types";
import { Lyrics } from "@/types";
//export function that creates a presenation given the lyrics
export default function generateppt(lyrics: Lyrics, song: string, artist: string, settings: Settings) {
  let { includeTitleSlide, backgroundColor, textColor, fontFamily = "arial" } = settings;
  let pres = new pptxgen();
  //add title slide with song name and artist, center the title inside of the slide and make it big
  if (includeTitleSlide) {
    let slide = pres.addSlide();
    slide.background = {
      fill: backgroundColor,
    };

    let textboxText = "";
    if (artist && song) {
      textboxText = `${song} by ${artist}`;
    } else {
      //set texboxText to be first line in lyrics
      textboxText = lyrics[0].lyrics.split("\n")[0];
    }
    slide.addText(textboxText, {
      y: "30%",
      w: "100%",
      h: "20%",
      fontSize: 36,
      fontFace: fontFamily,
      color: textColor,
      align: "center",
      wrap: true,
    });
  }
  // 2. Add a Slide
  for (let lyric of lyrics) {
    let slide = pres.addSlide();
    slide.background = {
      fill: backgroundColor,
    };
    let textboxText = (lyric.sectionTitle ? lyric.sectionTitle + "\n" : "") + lyric.lyrics;
    slide.addText(textboxText, {
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
      fontSize: 18,
      fontFace: fontFamily,
      color: textColor,
      align: "center",
      autoFit: true,
    });
  }
  // 3. Save the Presentation
  let fileName = "";

  if (artist && song) {
    fileName = `${song.replaceAll(" ", "_")}`;
  } else {
    fileName = "Lyrics" + Date.now();
  }

  const fullFileName = `${fileName}.pptx`;
  return pres
    .writeFile({ fileName: fullFileName })
    .then(() => {
      //return success
      return true;
    })
    .catch((err) => {
      return false;
    });
}
