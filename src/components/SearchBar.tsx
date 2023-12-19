import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Settings, Lyrics } from "@/types";
//import generate ppt from lib folder
import generatePpt from "@/lib/generatePPT";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import MessageDisplay from "./MessageDisplay";
import { processLyrics } from "@/lib/utils";
type Props = {
  settings: Settings;
  setResponseMessage: (message: { message: string; type: string }) => void;
};
const formSchema = z.object({
  song: z.string().min(1, {
    message: "Song cannot be empty",
  }),
  artist: z.string().min(1, {
    message: "Artist cannot be empty",
  }),
});

const SearchBar = ({ setResponseMessage, settings }: Props) => {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMessages, setErrorMessages] = useState({
    song: "",
    artist: "",
  });

  // Initialize refs for song and artist
  const prevSongRef = useRef<string | undefined>();
  const prevArtistRef = useRef<string | undefined>();
  const lyricsRef = useRef<Lyrics>([]);

  const handleArtistUpdate = (e: any) => {
    setArtist(e.target.value);
  };

  const handlesongUpdate = (e: any) => {
    setSong(e.target.value);
  };

  const updateLyrics = (e: any) => {
    lyricsRef.current = processLyrics(e.target.value);
  };

  const processPastedLyrics = async () => {
    console.log(lyricsRef.current);

    if (lyricsRef.current.length === 0) {
      setResponseMessage({ message: "Please paste lyrics", type: "error" });
      return;
    }
    setResponseMessage({ message: "", type: "" });
    setLoading(true);
    const link = document.createElement("a");
    try {
      let generatepptResponse = await generatePpt(lyricsRef.current, song, artist, settings);
      if (generatepptResponse) {
        setResponseMessage({ message: "Success! Check Your Downloads", type: "success" });
      }
    } catch (error: any) {
      const genericError = "Something went wrong. Please try again.";
      // Handle errors and show an alert or display an error message
      console.log("Error:", error.response.data);
      setResponseMessage({ message: error.response?.data?.error || genericError, type: "error" });
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

  const handleSubmit = async () => {
    setResponseMessage({ message: "", type: "" });
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

      return;
    } else {
      setErrorMessages({
        song: "",
        artist: "",
      });
    }
    setLoading(true);
    const link = document.createElement("a");

    try {
      if (!(song === prevSongRef.current && artist === prevArtistRef.current)) {
        const response = await axios.get(`/api/genius?song=${song}&artist=${artist}`, {
          params: {
            includeTitleSlide: settings.includeTitleSlide,
            backgroundColor: settings.backgroundColor,
            textColor: settings.textColor,
          },
        });
        lyricsRef.current = response.data.lyrics || [];
      } else {
        //wait for 1 second
        await new Promise((r) => setTimeout(r, 1000));
      }
      //then generate the ppt
      let generatepptResponse = await generatePpt(lyricsRef.current, song, artist, settings);
      if (generatepptResponse) {
        setResponseMessage({ message: "Success! Check Your Downloads", type: "success" });
      }
    } catch (error: any) {
      const genericError = "Something went wrong. Please try again.";
      // Handle errors and show an alert or display an error message
      console.log("Error:", error.response.data);
      setResponseMessage({ message: error.response?.data?.error || genericError, type: "error" });
    } finally {
      prevSongRef.current = song;
      prevArtistRef.current = artist;
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
    <div className="w-full">
      <Tabs
        defaultValue="query"
        className="mx-auto"
        onValueChange={() => {
          setResponseMessage({ message: "", type: "" });
        }}
      >
        <TabsList className="w-full">
          <TabsTrigger value="query">Search by Song Name</TabsTrigger>
          <TabsTrigger value="paste">Paste Lyrics</TabsTrigger>
        </TabsList>
        <TabsContent value="query">
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
        </TabsContent>
        <TabsContent value="paste">
          <label htmlFor="lyrics" className="text-sm">
            Paste Lyrics Below
          </label>
          <Textarea onChange={updateLyrics} className="mb-4 mt-2 h-56" placeholder="Lyrics" name="lyrics" id="lyrics" />
          <MessageDisplay
            responseMessage={{ type: "info", message: "Add empty lines where a new slide should be made." }}
          />
          <div className="flex justify-end">
            <Button onClick={processPastedLyrics} disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2" size={24} />}
              Submit
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchBar;
