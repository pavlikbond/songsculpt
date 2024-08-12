"use client";

import { useState, useEffect } from "react";

import SearchBar from "./SearchBar";
import SettingsBox from "./Settings";
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
  includeSectionTitles: true,
  textShadow: false,
  linesPerSlide: "100",
};

const SongQuery = (props: Props) => {
  const [isClient, setIsClient] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    if (isClient) {
      const localStorageSettings = getSettings();

      const updatedSettings = {
        ...defaultSettings,
        ...localStorageSettings,
      };

      setSettings(updatedSettings);
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
      <main className="hero">
        <section className="max-w-2xl my-6 md:my-12 mx-auto">
          <h1 className="text-xl md:text-5xl font-bold text-indigo-900 text-center mb-4 !leading-snug">
            Turn Lyrics into PowerPoint Presentations!
          </h1>
          <p className="text-sm md:text-xl text-center text-slate-700">
            {isClient && window.innerWidth > 768 ? desktopHero : mobileHero}
          </p>
        </section>
        <SearchBar settings={settings}></SearchBar>
      </main>

      <div className="grid gap-6">
        <SettingsBox settings={settings} setSettings={setSettings} fontFamilies={fontFamilies} />

        <ExampleSlide settings={settings} />
      </div>
    </div>
  );
};

const desktopHero = `Our innovative application transforms song lyrics into captivating PowerPoint presentations. Whether you’re
pasting lyrics directly or searching by song title and artist name, creating engaging presentations has
never been easier!`;

const mobileHero = `Our innovative application transforms song lyrics into captivating PowerPoint presentations.`;

export default SongQuery;
