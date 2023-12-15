"use client";

import { useState } from "react";
import MessageDisplay from "./MessageDisplay";
import SearchBar from "./SearchBar";
import Settings from "./Settings";
import ExampleSlide from "./ExampleSlide";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
type Props = {};

const SongQuery = (props: Props) => {
  const [responseMessage, setResponseMessage] = useState({ message: "", type: "" });
  const [settings, setSettings] = useState({
    includeTitleSlide: true,
    backgroundColor: "#dbdbdb",
    textColor: "#000000",
  });
  return (
    <div className="flex flex-col w-full mx-auto max-w-2xl">
      <SearchBar settings={settings} setResponseMessage={setResponseMessage}></SearchBar>
      <MessageDisplay responseMessage={responseMessage} setResponseMessage={setResponseMessage} />
      <div className="grid gap-6">
        <Settings settings={settings} setSettings={setSettings} />
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
