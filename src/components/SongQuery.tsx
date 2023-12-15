"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import axios from "axios";
import MessageDisplay from "./MessageDisplay";
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
  const [responseMessage, setResponseMessage] = useState({ message: "", type: "" });

  const handleArtistUpdate = (e: any) => {
    setArtist(e.target.value);
  };

  const handlesongUpdate = (e: any) => {
    setSong(e.target.value);
  };

  const handleSubmit = async () => {
    setResponseMessage({ message: "", type: "" });
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
    const link = document.createElement("a");

    try {
      const response = await axios.get(`/api/genius?song=${song}&artist=${artist}`, { responseType: "blob" });

      // Set the download attribute to the filename
      link.download = "presentation.pptx";

      // Create a Blob object from the response data
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });

      // Set the href attribute to the URL of the Blob
      link.href = window.URL.createObjectURL(blob);

      // Append the link to the document body
      document.body.appendChild(link);

      // Click the link to trigger the download
      link.click();
    } catch (error: any) {
      // Handle errors and show an alert or display an error message
      console.log("Error:", error.response.data);
      switch (error.response.request.status) {
        case 404:
          setResponseMessage({ message: "Song not found", type: "error" });
          break;
        default:
          break;
      }
    } finally {
      // Remove the link from the document body
      try {
        document.body.removeChild(link);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
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
      <div>
        <MessageDisplay responseMessage={responseMessage} setResponseMessage={setResponseMessage} />
      </div>
    </div>
  );
};

export default SongQuery;
