import Fuse from "fuse.js";

export default function getMostRelevantResult(hits, song, artist) {
  // Sample data from the API response

  // Create a list of items to search through
  const itemsToSearch = hits.map((hit) => ({
    title: hit.result.full_title,
    artist: hit.result.artist_names,
  }));

  // Create the Fuse instance with options for fuzzy searching
  const fuseOptions = {
    shouldSort: true,
    threshold: 0.6,
    keys: ["title", "artist"],
  };

  const fuse = new Fuse(itemsToSearch, fuseOptions);

  // Perform the fuzzy search
  const searchResults = fuse.search({
    title: song,
    artist: artist,
  });

  // Get the most relevant result
  const mostRelevantResult = searchResults[0];

  // Display the most relevant result
  if (mostRelevantResult) {
    console.log("Most relevant match:", mostRelevantResult.item);
    // return hits.find((hit) => {
    //   return (
    //     hit.result.full_title === mostRelevantResult.item.title &&
    //     hit.result.artist_names === mostRelevantResult.item.artist
    //   );
    // });
    return null;
  } else {
    console.log("Fuzzy search didn't work:");
    return null;
  }
}
