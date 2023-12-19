import pptxgen from "pptxgenjs";
import { Settings } from "@/types";

//export function that creates a presenation given the lyrics
export default function generateppt(
  lyrics: { sectionTitle: string; lyrics: string }[],
  song: string,
  artist: string,
  settings: Settings
) {
  let { includeTitleSlide, backgroundColor, textColor, fontFamily = "arial" } = settings;
  let pres = new pptxgen();
  //add title slide with song name and artist, center the title inside of the slide and make it big
  if (includeTitleSlide) {
    let slide = pres.addSlide();
    slide.background = {
      fill: backgroundColor,
    };

    let textboxText = `${song} by ${artist}`;
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
  const fileName = `${song.replaceAll(" ", "_")}.pptx`;
  return pres
    .writeFile({ fileName: fileName })
    .then(() => {
      //return success
      return true;
    })
    .catch((err) => {
      return false;
    });
}
