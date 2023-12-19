import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function processLyrics(lyricsString: string): { sectionTitle: string | null; lyrics: string }[] {
  const sections = lyricsString.split("\n\n");

  const lyricsArray = sections.map((section) => {
    let sectionTitle = null;
    let lyrics = section.trim();

    // Check if the section starts with a known keyword
    const keywordMatch = section.match(/^([A-Z]+\s\d*)/);
    if (keywordMatch) {
      sectionTitle = keywordMatch[1].replace(/\n/g, ""); // Remove newline characters
      lyrics = section.replace(keywordMatch[0], "").trim();
    } else {
      // Check if the section has square brackets
      const bracketMatch = section.match(/\[(.*?)\]/);
      if (bracketMatch) {
        sectionTitle = bracketMatch[1].replace(/\n/g, ""); // Remove newline characters
        lyrics = section.replace(/\[(.*?)\]/, "").trim();
      }
    }

    return {
      sectionTitle,
      lyrics,
    };
  });

  return lyricsArray;
}
