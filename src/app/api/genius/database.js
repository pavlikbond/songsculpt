import { createConnection } from "mysql2/promise";
import { config } from "dotenv";

config();

export async function addRowToDb(
  queryArtistName,
  querySongName,
  resultArtistName,
  resultSongName,
  lyricsUrl,
  lyrics,
  userLiked
) {
  const connection = await createConnection(process.env.DATABASE_URL);

  const [rows] = await connection.execute(
    `INSERT INTO queries (query_artist_name, query_song_name, result_artist_name, result_song_name, lyrics_url, lyrics, user_liked) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [queryArtistName, querySongName, resultArtistName, resultSongName, lyricsUrl, lyrics, userLiked]
  );

  console.log(rows.insertId);

  await connection.end();

  return rows.insertId;
}
