import { useState, useEffect, useRef } from "react";
import MessageDisplay from "./MessageDisplay";
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
import { processLyrics } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { event } from "@/lib/gtag";
type Props = {
  settings: Settings;
};
const formSchema = z.object({
  song: z.string().min(1, {
    message: "Song cannot be empty",
  }),
  artist: z.string().min(1, {
    message: "Artist cannot be empty",
  }),
});

const SearchBar = ({ settings }: Props) => {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState({ message: "", type: "" });
  const [pasteError, setPasteError] = useState(false);
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
    pasteError && setPasteError(false);
    responseMessage.message && setResponseMessage({ message: "", type: "" });
    lyricsRef.current = processLyrics(e.target.value);
  };

  const handlePastedLyrics = async () => {
    event({
      action: "click", // The type of interaction you want to track, e.g., 'click'
      category: "Button", // The object that was interacted with, e.g., 'Button'
      label: "paste_submit", // Useful for categorizing events, e.g., 'paste_submit'
      value: "1", // A numeric value associated with the event, e.g., '1'
    });
    pasteError && setPasteError(false);
    if (lyricsRef.current.length === 0) {
      setResponseMessage({ message: "Field can't be blank", type: "error" });
      return;
    }
    setResponseMessage({ message: "", type: "" });
    setLoading(true);

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
      setLoading(false);
    }
  };

  const handleQuerySubmit = async () => {
    event({
      action: "click", // The type of interaction you want to track, e.g., 'click'
      category: "Button", // The object that was interacted with, e.g., 'Button'
      label: "query_submit", // Useful for categorizing events, e.g., 'paste_submit'
      value: "1", // A numeric value associated with the event, e.g., '1'
    });
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

    try {
      if (!(song === prevSongRef.current && artist === prevArtistRef.current)) {
        const response = await axios.get(`/api/genius?song=${song}&artist=${artist}`);
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
      prevSongRef.current = song;
      prevArtistRef.current = artist;
    } catch (error: any) {
      const genericError = "Something went wrong. Please try again.";
      // Handle errors and show an alert or display an error message
      console.log("Error:", error.response.data);
      setResponseMessage({ message: error.response?.data?.error || genericError, type: "error" });
      //clear song and artist refs so that the next time the user searches, it will be a new search
      prevSongRef.current = "";
      prevArtistRef.current = "";
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (type: string) => {
    if (type === "query") {
      handleQuerySubmit();
    } else {
      handlePastedLyrics();
    }
  };

  return (
    <Card className="bg-indigo-100">
      <CardHeader>
        <CardTitle className="text-center">Generate PowerPoint</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="query"
          className="mx-auto"
          onValueChange={() => {
            setResponseMessage({ message: "", type: "" });
          }}
        >
          <TabsList className="w-full bg-indigo-300">
            <TabsTrigger value="query" className="text-white text-xs md:text-base">
              Search by Song Name
            </TabsTrigger>
            <TabsTrigger value="paste" className="text-white text-xs md:text-base">
              Paste Lyrics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="query">
            <div className="flex md:gap-4 h-fit items-center flex-col md:flex-row py-8">
              <div className="grid items-center gap-1.5 w-full">
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
              <div className="grid items-center gap-1.5 w-full">
                <label htmlFor="artist" className="text-sm">
                  Artist
                </label>
                <Input
                  placeholder="Artist"
                  id="artist"
                  onChange={handleArtistUpdate}
                  className={errorMessages.artist ? "border border-red-400" : ""}
                />
                <p className="text-red-500 text-sm h-5">{errorMessages.artist}</p>
              </div>

              <Button
                onClick={() => {
                  onSubmit("query");
                }}
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin mr-2" size={24} />}
                Submit
              </Button>
            </div>
            {responseMessage.message && <MessageDisplay responseMessage={responseMessage}></MessageDisplay>}
          </TabsContent>
          <TabsContent value="paste">
            <div className="py-8">
              <label htmlFor="lyrics" className="text-sm">
                Paste Lyrics Below
              </label>
              <Textarea
                onChange={updateLyrics}
                className="mb-4 mt-2 h-56"
                placeholder="Lyrics"
                name="lyrics"
                id="lyrics"
              />
              <MessageDisplay
                responseMessage={{ type: "info", message: "Add empty lines where a new slide should be made." }}
              />
              {responseMessage.message && <MessageDisplay responseMessage={responseMessage}></MessageDisplay>}
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    onSubmit("paste");
                  }}
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin mr-2" size={24} />}
                  Submit
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SearchBar;
