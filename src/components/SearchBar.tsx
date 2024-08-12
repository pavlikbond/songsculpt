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
import { useMutation } from "@tanstack/react-query";
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

const logEvent = (label: string) => {
  event({
    action: "click",
    category: "Button",
    label: label,
    value: "1",
  });
};
const SearchBar = ({ settings }: Props) => {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState({ message: "", type: "" });
  const formChanged = useRef(false);
  const [errorMessages, setErrorMessages] = useState({
    song: "",
    artist: "",
  });

  // Initialize refs for song and artist
  const lyricsRef = useRef<Lyrics>([]);

  const handleArtistUpdate = (e: any) => {
    setArtist(e.target.value.trim());
    formChanged.current = true;
  };

  const handlesongUpdate = (e: any) => {
    setSong(e.target.value.trim());
    formChanged.current = true;
  };

  const updateLyrics = (e: any) => {
    responseMessage.message && setResponseMessage({ message: "", type: "" });
    lyricsRef.current = processLyrics(e.target.value);
  };

  const handlePastedLyrics = async () => {
    logEvent("paste_lyrics");

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

  const mutation = useMutation({
    mutationKey: ["getLyrics"],
    mutationFn: async (formData: any) => {
      const response = await axios.put(`/api/genius`, formData);
      return response.data;
    },
    onSuccess: async (data) => {
      lyricsRef.current = data.lyrics || [];
      createPpt();
    },
    onSettled: () => {
      formChanged.current = false;
    },
  });

  async function createPpt() {
    let generatepptResponse = await generatePpt(lyricsRef.current, song, artist, settings);
    if (generatepptResponse) {
      setResponseMessage({ message: "Success! Check Your Downloads", type: "success" });
    }
  }

  // Separate validation function
  const validateForm = (data: { song: string; artist: string }) => {
    const results = formSchema.safeParse(data);
    if (!results.success) {
      const errorMessages = results.error.flatten().fieldErrors;
      return {
        isValid: false,
        errors: {
          song: errorMessages.song?.[0] || "",
          artist: errorMessages.artist?.[0] || "",
        },
      };
    }
    return { isValid: true, errors: { song: "", artist: "" } };
  };

  const handleQuerySubmit = async () => {
    logEvent("query_submit");
    setResponseMessage({ message: "", type: "" });
    const { isValid, errors } = validateForm({ song, artist });
    setErrorMessages(errors);

    if (!isValid) {
      return;
    }

    if (!formChanged.current) {
      createPpt();
    } else {
      mutation.mutate({
        song,
        artist,
      });
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
                disabled={loading || mutation.isPending}
              >
                {loading || (mutation.isPending && <Loader2 className="animate-spin mr-2" size={24} />)}
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
                  disabled={loading || mutation.isPending}
                >
                  {loading || (mutation.isPending && <Loader2 className="animate-spin mr-2" size={24} />)}
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
