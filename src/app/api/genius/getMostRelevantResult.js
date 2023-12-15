import Fuse from "fuse.js";

export default function getMostRelevantResult(hits, song, artist) {
  console.log("hits:", hits);
  //if hits are an empty array return null
  if (hits.length === 0) {
    return null;
  }
  // Create a list of items to search through
  const itemsToSearch = hits.map((hit) => ({
    title: removeStopWords(hit.result.full_title),
    artist: removeStopWords(hit.result.artist_names),
  }));

  // Remove stop words from search query
  song = removeStopWords(song);
  artist = removeStopWords(artist);

  let threshold = 0.4;
  let mostRelevantResult = null;

  while (!mostRelevantResult && threshold <= 1) {
    // Create the Fuse instance with options for fuzzy searching
    const fuseOptions = {
      shouldSort: true,
      threshold: threshold,
      keys: ["title", "artist"],
    };

    const fuse = new Fuse(itemsToSearch, fuseOptions);

    // Perform the fuzzy search
    const searchResults = fuse.search({
      title: song,
      artist: artist,
    });

    // Get the most relevant result
    mostRelevantResult = searchResults[0];

    // Increase the threshold for the next iteration if no result was found
    if (!mostRelevantResult) {
      threshold += 0.1;
    }
  }

  // Display the most relevant result
  if (mostRelevantResult) {
    console.log("Most relevant match:", mostRelevantResult.item);
    const foundHit = hits.find((hit) => {
      return (
        removeStopWords(hit.result.full_title) === mostRelevantResult.item.title &&
        removeStopWords(hit.result.artist_names) === mostRelevantResult.item.artist
      );
    });
    //console.log("Found hit:", foundHit);
    return foundHit;
  } else {
    console.log("Fuzzy search didn't work even with threshold adjustment:");
    return null;
  }
}

function removeStopWords(string) {
  const stopWords = ["the", "a", "an"];
  const words = string.toLowerCase().split(" ");
  const filteredWords = words.filter((word) => !stopWords.includes(word));
  return filteredWords.join(" ");
}
