"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import axios from "axios";
type Props = {};
const formSchema = z.object({
  song: z.string().min(1, {
    message: "Song cannot be empty",
  }),
  artist: z.string().min(1, {
    message: "Artist cannot be empty",
  }),
});

const SongQuery = (props: Props) => {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    song: "",
    artist: "",
  });

  const handleArtistUpdate = (e: any) => {
    setArtist(e.target.value);
  };

  const handlesongUpdate = (e: any) => {
    setSong(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = {
      song: song.trim(),
      artist: artist.trim(),
    };
    const results = formSchema.safeParse(formData);
    if (!results.success) {
      let issues = results.error.issues;
      setErrorMessages({
        song: issues.find((issue) => issue.path[0] === "song")?.message || "",
        artist: issues.find((issue) => issue.path[0] === "artist")?.message || "",
      });
      setLoading(false);
      return;
    } else {
      setErrorMessages({
        song: "",
        artist: "",
      });
    }
    //fetch data from the api/lyrics endpoint using axios and a GET request
    try {
      const res = await axios.get(`/api/lyrics`, {
        params: {
          song: song,
          artist: artist,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-4 h-fit items-center flex-col md:flex-row ">
      <div className="grid items-center gap-1.5 ">
        <label htmlFor="song" className="text-sm">
          Song name
        </label>
        <Input
          placeholder="Song Name"
          id="song"
          onChange={handlesongUpdate}
          className={errorMessages.song ? "border border-red-400" : ""}
        />
        <p className="text-red-500 text-sm h-5 ">{errorMessages.song}</p>
      </div>
      <div className="grid items-center gap-1.5">
        <label htmlFor="artist" className="text-sm">
          Artist
        </label>
        <Input
          placeholder="Astist"
          id="artist"
          onChange={handleArtistUpdate}
          className={errorMessages.artist ? "border border-red-400" : ""}
        />
        <p className="text-red-500 text-sm h-5">{errorMessages.artist}</p>
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading && <Loader2 className="animate-spin mr-2" size={24} />}
        Submit
      </Button>
    </div>
  );
};

export default SongQuery;
