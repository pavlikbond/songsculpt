import pptxgen from "pptxgenjs";

//export function that creates a presenation given the lyrics
export default function generateppt(
  lyrics: { sectionTitle: string; lyrics: string }[],
  song: string,
  artist: string,
  includeTitleSlide: boolean,
  backgroundColor: string,
  textColor: string
) {
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
      color: textColor,
      align: "center",
      autoFit: true,
    });
  }
  return pres;
}
