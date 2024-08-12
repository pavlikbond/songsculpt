export type Settings = {
  includeTitleSlide: boolean;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  includeSectionTitles: boolean;
  textShadow: boolean;
  linesPerSlide: string;
};

export type Lyrics = {
  sectionTitle?: string | null;
  lyrics: string;
}[];
