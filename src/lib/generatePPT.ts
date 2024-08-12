import pptxgen from "pptxgenjs";
import { Settings } from "@/types";
import { Lyrics } from "@/types";

const shadow = {
  type: "outer",
  color: "666666",
  blur: 3,
  offset: 1,
  angle: 45,
};

//export function that creates a presenation given the lyrics
export default async function generateppt(lyrics: Lyrics, song: string, artist: string, settings: Settings) {
  let {
    includeTitleSlide,
    backgroundColor,
    textColor,
    fontFamily = "arial",
    includeSectionTitles,
    textShadow,
    linesPerSlide,
  } = settings;

  let pres = new pptxgen();
  const linesPerSlideNum: number = parseInt(linesPerSlide) || 100;

  let newLyrics = [];
  //split lyrics into sections based on new lines
  for (let i = 0; i < lyrics.length; i++) {
    lyrics[i].lyrics = lyrics[i].lyrics?.replaceAll("\r", "\n").replaceAll("\n\n", "\n");
    let splitLyrics = lyrics[i].lyrics.split("\n");
    for (let j = 0; j < splitLyrics.length; j += linesPerSlideNum) {
      newLyrics.push({
        sectionTitle: j === 0 ? lyrics[i].sectionTitle : null,
        lyrics: splitLyrics.slice(j, j + linesPerSlideNum).join("\n"),
      });
    }
  }

  lyrics = newLyrics;

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

    const slideSettings = {
      y: "30%",
      w: "100%",
      h: "20%",
      fontSize: 36,
      fontFace: fontFamily,
      color: textColor,
      align: "center",
      wrap: true,
    } as any;

    if (textShadow) {
      slideSettings["shadow"] = { ...shadow };
    }
    slide.addText(textboxText, slideSettings);
  }
  // 2. Add a Slide
  for (let lyric of lyrics) {
    let slide = pres.addSlide();
    slide.background = {
      fill: backgroundColor,
    };
    let textboxText = (lyric?.sectionTitle && includeSectionTitles ? lyric?.sectionTitle + "\n" : "") + lyric.lyrics;
    const slideSettings = {
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
      fontSize: 18,
      fontFace: fontFamily,
      color: textColor,
      align: "center",
      autoFit: true,
    } as any;

    if (textShadow) {
      //need to make copy of shadow object because it gets modified with each loop
      slideSettings["shadow"] = { ...shadow };
    }

    slide.addText(textboxText, slideSettings);
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
      console.error(err);
      return false;
    });
}
