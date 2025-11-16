import Fuse, { IFuseOptions } from "fuse.js";
import { GeniusSearchHit } from "@/types";

type SearchItem = {
  title: string;
  artist: string;
};

type FuseSearchResult = {
  item: SearchItem;
  refIndex: number;
  score?: number;
};

export default function getMostRelevantResult(
  hits: GeniusSearchHit[],
  song: string,
  artist: string
): GeniusSearchHit | null {
  //if hits are an empty array return null
  if (hits.length === 0) {
    return null;
  }

  console.log("hits:", hits);
  // Safely log debug info with optional chaining
  if (hits[0]?.result) {
    console.log(hits[0].result.stats);
    console.log(hits[0].result.primary_artist);
    console.log(hits[0].result.primary_artists);
  }
  //if hits title contains the word 'instrumental' filter it out
  // Also filter out any hits with missing result data
  let filteredHits = hits.filter((hit) => {
    if (!hit?.result?.full_title) return false;
    return !hit.result.full_title.toLowerCase().includes("instrumental");
  });

  //filter out songs that say 'remix' in the title unless the search query also contains the word 'remix'
  if (!song.toLowerCase().includes("remix")) {
    filteredHits = filteredHits.filter((hit) => {
      if (!hit?.result?.full_title) return false;
      return !hit.result.full_title.toLowerCase().includes("remix");
    });
  }

  // Create a list of items to search through
  const itemsToSearch: SearchItem[] = filteredHits
    .filter((hit) => hit?.result?.full_title && hit?.result?.artist_names)
    .map((hit) => ({
      title: removeStopWords(hit.result.full_title),
      artist: removeStopWords(hit.result.artist_names),
    }));

  // Remove stop words from search query
  const normalizedSong = removeStopWords(song);
  const normalizedArtist = artist ? removeStopWords(artist) : "";

  let threshold = 0.4;
  let mostRelevantResult: FuseSearchResult | null = null;

  while (!mostRelevantResult && threshold <= 1) {
    // Create the Fuse instance with options for fuzzy searching
    // If artist is provided, search both fields; otherwise only search title
    const fuseOptions: IFuseOptions<SearchItem> = {
      shouldSort: true,
      threshold: threshold,
      keys: normalizedArtist ? ["title", "artist"] : ["title"],
    };

    const fuse = new Fuse(itemsToSearch, fuseOptions);

    // Perform the fuzzy search
    // When artist is provided, search both fields; otherwise search by title only using string
    const searchQuery = normalizedArtist ? { title: normalizedSong, artist: normalizedArtist } : normalizedSong;

    const searchResults = fuse.search(searchQuery);

    // Get the most relevant result
    mostRelevantResult = searchResults[0] || null;

    // Increase the threshold for the next iteration if no result was found
    if (!mostRelevantResult) {
      threshold += 0.1;
    }
  }

  // Display the most relevant result
  if (mostRelevantResult) {
    console.log("Most relevant match:", mostRelevantResult.item);
    const foundHit = filteredHits.find((hit) => {
      return (
        removeStopWords(hit.result.full_title) === mostRelevantResult!.item.title &&
        removeStopWords(hit.result.artist_names) === mostRelevantResult!.item.artist
      );
    });
    //console.log("Found hit:", foundHit);
    return foundHit || null;
  } else {
    console.log("Fuzzy search didn't work even with threshold adjustment:");
    return null;
  }
}

function removeStopWords(string: string): string {
  const stopWords = ["the", "a", "an"];
  const words = string.toLowerCase().split(" ");
  const filteredWords = words.filter((word) => !stopWords.includes(word));
  return filteredWords.join(" ");
}
