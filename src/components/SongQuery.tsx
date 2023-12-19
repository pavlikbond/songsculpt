"use client";

import { useState, useEffect } from "react";
import MessageDisplay from "./MessageDisplay";
import SearchBar from "./SearchBar";
import Settings from "./Settings";
import ExampleSlide from "./ExampleSlide";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
  const [responseMessage, setResponseMessage] = useState({ message: "", type: "" });
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
    <div className="flex flex-col w-full mx-auto max-w-2xl">
      <SearchBar settings={settings} setResponseMessage={setResponseMessage}></SearchBar>
      <MessageDisplay responseMessage={responseMessage} setResponseMessage={setResponseMessage} />
      <div className="grid gap-6">
        <Settings settings={settings} setSettings={setSettings} fontFamilies={fontFamilies} />
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Show Example Slide</AccordionTrigger>
            <AccordionContent>
              <ExampleSlide settings={settings} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SongQuery;
