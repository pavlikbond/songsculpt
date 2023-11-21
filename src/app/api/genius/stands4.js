import axios from "axios";

export default async function getLyricsFromStands4(song, artist) {
  let uid = process.env.STANDS4_USER_ID;
  let token = process.env.STANDS4_TOKEN;

  const result = await axios.get(
    `https://www.stands4.com/services/v2/lyrics.php?uid=${uid}&tokenid=${token}&term=${song}&artist=${artist}&format=json`
  );
  console.log(result.data);
}
