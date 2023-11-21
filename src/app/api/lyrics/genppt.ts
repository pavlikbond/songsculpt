import pptxgen from "pptxgenjs";

export default function generateppt(lyric: string, filename: string) {
  // 1. Create a new Presentation
  let pres = new pptxgen();

  // 2. Add a Slide
  let slide = pres.addSlide();
  let textboxText = lyric;
  slide.addText(textboxText, { x: 1, y: 1, w: 3, h: 1, fontSize: 18, color: "363636" });
  pres
    .stream()
    .catch((err) => {
      console.log(err);
    })
    .then((data) => {
      console.log(data);
    });
}
