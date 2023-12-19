import React from "react";
import { Settings } from "@/types";
type Props = {
  settings: Settings;
};

const ExampleSlide = ({ settings }: Props) => {
  return (
    <div className="rounded border-2 shadow p-6 overflow-hidden">
      <h2 className="text-center text-2xl mb-4 font-semibold text-slate-600">Example Slide</h2>
      <div className="overflow-hidden border rounded shadow border-slate-600 text-center w-full aspect-video">
        <div
          className="p-6 h-full flex flex-col items-center justify-center"
          style={{ color: settings.textColor, backgroundColor: settings.backgroundColor }}
        >
          <p className="text-[6px] leading-snug sm:text-xs  md:text-sm" style={{ fontFamily: settings.fontFamily }}>
            Verse 1
          </p>
          {lyrics.split("\n").map((line, index) => {
            return (
              <p
                style={{ fontFamily: settings.fontFamily }}
                key={index}
                className="text-[6px] leading-snug sm:text-xs  md:text-sm"
              >
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExampleSlide;

const lyrics = `
Dashing through the snow 
In a one-horse open sleigh 
Over the hills we go 
Laughing all the way 
The bells on bobtail ring 
They make spirits bright
What fun it is to ride 
and sing a sleighing song tonight`;
