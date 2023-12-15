import pptxgen from "pptxgenjs";

//export function that creates a presenation given the lyrics
export default function generateppt(lyrics: { sectionTitle: string; lyrics: string }[], song: string, artist: string) {
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

  // 2. Add a Slide
  for (let lyric of lyrics) {
    let slide = pres.addSlide();
    let textboxText = (lyric.sectionTitle ? lyric.sectionTitle + "\n" : "") + lyric.lyrics;
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
  return pres;
}
