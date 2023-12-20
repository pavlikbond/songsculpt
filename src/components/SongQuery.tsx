"use client";

import { useState, useEffect } from "react";

import SearchBar from "./SearchBar";
import Settings from "./Settings";
import ExampleSlide from "./ExampleSlide";

type Props = {};
const fontFamilies = [
  "Arial",
  "Arial Black",
  "Comic Sans MS",
  "Courier New",
  "Georgia",
  "Impact",
  "Lucida Console",
  "Lucida Sans Unicode",
  "Palatino Linotype",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
];

const defaultSettings = {
  includeTitleSlide: false,
  backgroundColor: "#dbdbdb",
  textColor: "#000000",
  fontFamily: fontFamilies[0],
};

const SongQuery = (props: Props) => {
  const [isClient, setIsClient] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    if (isClient) {
      setSettings(getSettings());
    }
  }, [isClient]);

  useEffect(() => {
    import("webfontloader").then((WebFont) => {
      WebFont.load({
        google: {
          families: fontFamilies,
        },
      });
    });
    setIsClient(true);
  }, []);

  function getSettings() {
    const localSettings = localStorage.getItem("settings");
    if (localSettings) {
      return JSON.parse(localSettings);
    } else return defaultSettings;
  }

  //useEffect to save settings to localStorage any time settings are updated
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("settings", JSON.stringify(settings));
    }
  }, [settings]);

  return (
    <div className="flex flex-col gap-10 w-full mx-auto max-w-2xl my-6 md:my-12">
      <SearchBar settings={settings}></SearchBar>

      <div className="grid gap-6">
        <Settings settings={settings} setSettings={setSettings} fontFamilies={fontFamilies} />

        <ExampleSlide settings={settings} />
      </div>
    </div>
  );
};

export default SongQuery;
