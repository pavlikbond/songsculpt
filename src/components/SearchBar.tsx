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
import { Textarea } from "@/components/ui/textarea";
import { processLyrics } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { event } from "@/lib/gtag";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

type Props = {
  settings: Settings;
};
const formSchema = z.object({
  song: z.string().min(1, {
    message: "Song cannot be empty",
  }),
  artist: z.string().optional(),
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
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState({ message: "", type: "" });
  const [activeMethod, setActiveMethod] = useState("query");
  const formChanged = useRef(false);
  const [errorMessages, setErrorMessages] = useState({
    song: "",
    artist: "",
    url: "",
  });

  // Initialize refs for song and artist
  const lyricsRef = useRef<Lyrics>([]);
  const lyricsTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleArtistUpdate = (e: any) => {
    setArtist(e.target.value);
    formChanged.current = true;
  };

  const handlesongUpdate = (e: any) => {
    setSong(e.target.value);
    formChanged.current = true;
  };

  const updateLyrics = (e: any) => {
    responseMessage.message && setResponseMessage({ message: "", type: "" });
    lyricsRef.current = processLyrics(e.target.value);
  };

  const handleUrlUpdate = (e: any) => {
    setUrl(e.target.value);
    setErrorMessages({ ...errorMessages, url: "" });
    formChanged.current = true;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && activeMethod === "query") {
      e.preventDefault();
      handleQuerySubmit();
    }
  };

  // Validate Genius URL on frontend
  const isValidGeniusUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      const hostname = urlObj.hostname.toLowerCase();
      return hostname === "genius.com" || hostname === "www.genius.com";
    } catch (error) {
      return false;
    }
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
      } else {
        setResponseMessage({ message: "Failed to create PowerPoint. Please try again.", type: "error" });
      }
    } catch (error: any) {
      console.error("Error creating PowerPoint:", error);
      // Check if it's a network/server error or a specific PowerPoint generation error
      if (
        error.code === "ECONNREFUSED" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ENOTFOUND" ||
        (error.response && error.response.status >= 500)
      ) {
        setResponseMessage({ message: "Something went wrong. Please try again.", type: "error" });
      } else {
        setResponseMessage({
          message: "Failed to create PowerPoint. Please check your lyrics and try again.",
          type: "error",
        });
      }
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
    onError: (error: any) => {
      // Parse error message from API response
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response?.data?.message) {
        // Use the specific error message from the API
        errorMessage = error.response.data.message;
      } else if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT" || error.code === "ENOTFOUND") {
        // Network error
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.response?.status >= 500) {
        // Server error
        errorMessage = "Server error. Please try again later.";
      }

      toast.error(errorMessage, {
        duration: 4000,
      });
    },
    onSettled: () => {
      formChanged.current = false;
    },
  });

  const urlMutation = useMutation({
    mutationKey: ["getLyricsFromUrl"],
    mutationFn: async (urlData: { url: string }) => {
      const response = await axios.post(`/api/genius/url`, urlData);
      return response.data;
    },
    onSuccess: async (data) => {
      lyricsRef.current = data.lyrics || [];
      // Update song and artist if available from URL data
      if (data.song) setSong(data.song);
      if (data.artist) setArtist(data.artist);
      createPpt();
    },
    onError: (error: any) => {
      // Parse error message from API response
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response?.data?.message) {
        // Use the specific error message from the API
        errorMessage = error.response.data.message;
      } else if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT" || error.code === "ENOTFOUND") {
        // Network error
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.response?.status >= 500) {
        // Server error
        errorMessage = "Server error. Please try again later.";
      }

      toast.error(errorMessage, {
        duration: 4000,
      });
      setErrorMessages({ ...errorMessages, url: errorMessage });
    },
    onSettled: () => {
      formChanged.current = false;
    },
  });

  async function createPpt(overrideSong?: string, overrideArtist?: string) {
    try {
      const songToUse = overrideSong !== undefined ? overrideSong : song.trim();
      const artistToUse = overrideArtist !== undefined ? overrideArtist : artist.trim();
      let generatepptResponse = await generatePpt(lyricsRef.current, songToUse, artistToUse, settings);
      if (generatepptResponse) {
        setResponseMessage({ message: "Success! Check Your Downloads", type: "success" });
        toast.success("PowerPoint created, check downloads", {
          duration: 4000,
        });
      } else {
        setResponseMessage({ message: "Failed to create PowerPoint. Please try again.", type: "error" });
        toast.error("Failed to create PowerPoint. Please try again.", {
          duration: 4000,
        });
      }
    } catch (error: any) {
      console.error("Error creating PowerPoint:", error);
      // Check if it's a network/server error or a specific PowerPoint generation error
      if (
        error.code === "ECONNREFUSED" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ENOTFOUND" ||
        (error.response && error.response.status >= 500)
      ) {
        setResponseMessage({ message: "Something went wrong. Please try again.", type: "error" });
        toast.error("Something went wrong. Please try again.", {
          duration: 4000,
        });
      } else {
        setResponseMessage({
          message: "Failed to create PowerPoint. Please check your lyrics and try again.",
          type: "error",
        });
        toast.error("Failed to create PowerPoint. Please check your lyrics and try again.", {
          duration: 4000,
        });
      }
    }
  }

  // Separate validation function
  const validateForm = (data: { song: string; artist?: string }) => {
    const results = formSchema.safeParse(data);
    if (!results.success) {
      const errorMessages = results.error.flatten().fieldErrors;
      return {
        isValid: false,
        errors: {
          song: errorMessages.song?.[0] || "",
          artist: errorMessages.artist?.[0] || "",
          url: "",
        },
      };
    }
    return { isValid: true, errors: { song: "", artist: "", url: "" } };
  };

  const handleQuerySubmit = async () => {
    logEvent("query_submit");
    setResponseMessage({ message: "", type: "" });
    const trimmedSong = song.trim();
    const trimmedArtist = artist.trim();
    const { isValid, errors } = validateForm({ song: trimmedSong, artist: trimmedArtist });
    setErrorMessages({ ...errorMessages, ...errors });

    if (!isValid) {
      return;
    }

    // if (!formChanged.current) {
    //   createPpt(trimmedSong, trimmedArtist);
    // } else {
    mutation.mutate({
      song: trimmedSong,
      artist: trimmedArtist,
    });
    // }
  };

  const handleUrlSubmit = async () => {
    logEvent("paste_url");
    setResponseMessage({ message: "", type: "" });

    const trimmedUrl = url.trim();

    // Frontend validation
    if (!trimmedUrl || trimmedUrl.length === 0) {
      setErrorMessages({ ...errorMessages, url: "URL cannot be empty" });
      return;
    }

    if (!isValidGeniusUrl(trimmedUrl)) {
      setErrorMessages({
        ...errorMessages,
        url: "Please enter a valid Genius.com URL",
      });
      return;
    }

    setErrorMessages({ ...errorMessages, url: "" });
    urlMutation.mutate({ url: trimmedUrl });
  };

  const onSubmit = (type: string) => {
    if (type === "query") {
      handleQuerySubmit();
    } else if (type === "paste") {
      handlePastedLyrics();
    } else if (type === "url") {
      handleUrlSubmit();
    }
  };

  const handleClear = () => {
    if (activeMethod === "query") {
      setSong("");
      setArtist("");
      setErrorMessages({ song: "", artist: "", url: "" });
      formChanged.current = false;
    } else if (activeMethod === "paste") {
      if (lyricsTextareaRef.current) {
        lyricsTextareaRef.current.value = "";
      }
      lyricsRef.current = [];
      setResponseMessage({ message: "", type: "" });
    } else if (activeMethod === "url") {
      setUrl("");
      setErrorMessages({ ...errorMessages, url: "" });
      formChanged.current = false;
    }
  };

  return (
    <Card className="bg-[var(--color-primary)] border-[var(--color-accent)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-[var(--color-text-dark)]">Generate PowerPoint</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Input Method Selection */}
        <div className="flex justify-center mb-6">
          {/* HTML Radio Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="query"
                name="method"
                value="query"
                checked={activeMethod === "query"}
                onChange={(e) => {
                  setActiveMethod(e.target.value);
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="query" className="text-[var(--color-text-dark)] cursor-pointer">
                Search by Song Name
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="paste"
                name="method"
                value="paste"
                checked={activeMethod === "paste"}
                onChange={(e) => {
                  setActiveMethod(e.target.value);
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="paste" className="text-[var(--color-text-dark)] cursor-pointer">
                Paste Lyrics
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="url"
                name="method"
                value="url"
                checked={activeMethod === "url"}
                onChange={(e) => {
                  setActiveMethod(e.target.value);
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="url" className="text-[var(--color-text-dark)] cursor-pointer">
                Paste URL
              </label>
            </div>
          </div>
        </div>
        {/* Query Method */}
        {activeMethod === "query" && (
          <div className="flex md:gap-4 h-fit items-center flex-col md:flex-row py-4">
            <div className="grid items-center gap-1.5 w-full">
              <label htmlFor="song" className="text-sm text-[var(--color-text-dark)]">
                Song name
              </label>
              <Input
                placeholder="Song Name"
                id="song"
                value={song}
                onChange={handlesongUpdate}
                onKeyDown={handleKeyDown}
                className={errorMessages.song ? "border border-red-400" : "border-[var(--color-accent)]"}
              />
              <p className="text-red-500 text-sm h-5 ">{errorMessages.song}</p>
            </div>
            <div className="grid items-center gap-1.5 w-full">
              <label htmlFor="artist" className="text-sm text-[var(--color-text-dark)]">
                Artist (Optional)
              </label>
              <Input
                placeholder="Artist (Optional)"
                id="artist"
                value={artist}
                onChange={handleArtistUpdate}
                onKeyDown={handleKeyDown}
                className={errorMessages.artist ? "border border-red-400" : "border-[var(--color-accent)]"}
              />
              <p className="text-red-500 text-sm h-5">{errorMessages.artist}</p>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Button
                onClick={handleClear}
                variant="outline"
                className="border-[var(--color-accent)] text-[var(--color-text-dark)] hover:bg-[var(--color-accent)]/10"
              >
                Clear
              </Button>
              <Button
                onClick={() => {
                  onSubmit("query");
                }}
                disabled={loading || mutation.isPending}
                className="bg-[var(--color-accent-dark)] hover:bg-[var(--color-accent)] text-white"
              >
                {loading || (mutation.isPending && <Loader2 className="animate-spin mr-2" size={24} />)}
                Submit
              </Button>
            </div>
          </div>
        )}

        {/* Paste Method */}
        {activeMethod === "paste" && (
          <div className="py-4">
            <label htmlFor="lyrics" className="text-sm text-[var(--color-text-dark)]">
              Paste Lyrics Below
            </label>
            <Textarea
              ref={lyricsTextareaRef}
              onChange={updateLyrics}
              className="mb-4 mt-2 h-48 border-[var(--color-accent)]"
              placeholder="Lyrics"
              name="lyrics"
              id="lyrics"
            />
            <MessageDisplay
              responseMessage={{ type: "info", message: "Add empty lines where a new slide should be made." }}
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleClear}
                variant="outline"
                className="border-[var(--color-accent)] text-[var(--color-text-dark)] hover:bg-[var(--color-accent)]/10"
              >
                Clear
              </Button>
              <Button
                onClick={() => {
                  onSubmit("paste");
                }}
                disabled={loading || mutation.isPending}
                className="bg-[var(--color-accent-dark)] hover:bg-[var(--color-accent)] text-white"
              >
                {loading || (mutation.isPending && <Loader2 className="animate-spin mr-2" size={24} />)}
                Submit
              </Button>
            </div>
          </div>
        )}

        {/* Paste URL Method */}
        {activeMethod === "url" && (
          <div className="py-4">
            <div className="grid items-center gap-1.5 w-full mb-4">
              <label htmlFor="genius-url" className="text-sm text-[var(--color-text-dark)]">
                Paste Genius URL
              </label>
              <Input
                placeholder="https://genius.com/artist-song"
                id="genius-url"
                value={url}
                onChange={handleUrlUpdate}
                className={errorMessages.url ? "border border-red-400" : "border-[var(--color-accent)]"}
              />
              <p className="text-red-500 text-sm h-5">{errorMessages.url}</p>
            </div>
            <MessageDisplay
              responseMessage={{
                type: "info",
                message: "The URL must be from Genius.com because that's where we source the lyrics.",
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleClear}
                variant="outline"
                className="border-[var(--color-accent)] text-[var(--color-text-dark)] hover:bg-[var(--color-accent)]/10"
              >
                Clear
              </Button>
              <Button
                onClick={() => {
                  onSubmit("url");
                }}
                disabled={loading || mutation.isPending || urlMutation.isPending}
                className="bg-[var(--color-accent-dark)] hover:bg-[var(--color-accent)] text-white"
              >
                {(loading || urlMutation.isPending) && <Loader2 className="animate-spin mr-2" size={24} />}
                Submit
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchBar;
