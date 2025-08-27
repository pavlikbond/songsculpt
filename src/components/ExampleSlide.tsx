import React from "react";
import { Settings } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
type Props = {
  settings: Settings;
};

const ExampleSlide = ({ settings }: Props) => {
  return (
    <Card className="bg-[var(--color-primary)] border-[var(--color-accent)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-[var(--color-text-dark)]">Example Slide</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden border rounded shadow border-[var(--color-accent)] text-center w-full aspect-video">
          <div
            className="p-6 h-full flex flex-col items-center justify-center"
            style={{ color: settings.textColor, backgroundColor: settings.backgroundColor }}
          >
            {settings.includeSectionTitles && (
              <p className="text-[6px] leading-snug sm:text-xs  md:text-sm" style={{ fontFamily: settings.fontFamily }}>
                Verse 1
              </p>
            )}
            {lyrics
              .split("\n")
              .slice(0, parseInt(settings.linesPerSlide) + 1 || 100)
              .map((line, index) => {
                return (
                  <p
                    style={{ fontFamily: settings.fontFamily }}
                    key={index}
                    className={cn("text-[6px] leading-snug sm:text-xs  md:text-sm", {
                      "drop-shadow": settings.textShadow,
                    })}
                  >
                    {line}
                  </p>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
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
