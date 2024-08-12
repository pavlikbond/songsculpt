"use client";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "./ui/label";

type Props = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  fontFamilies: string[];
};

const numberOfLinesOptions = ["1000", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const SettingsBox = ({ settings, setSettings, fontFamilies }: Props) => {
  return (
    <Card className="bg-slate-100">
      <CardHeader>
        <CardTitle className="text-center">Settings</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex gap-2">
              <Checkbox
                checked={settings.includeTitleSlide}
                id="includeTitle"
                onCheckedChange={(checked: boolean) => {
                  setSettings({ ...settings, includeTitleSlide: checked });
                }}
              />
              <label
                htmlFor="includeTitle"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {" "}
                Include Title Slide
              </label>
            </div>
            <div className="flex gap-2">
              <Checkbox
                checked={settings.includeSectionTitles}
                id="includeSectionTitles"
                onCheckedChange={(checked: boolean) => {
                  setSettings({ ...settings, includeSectionTitles: checked });
                }}
              />
              <label
                htmlFor="includeSectionTitles"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {" "}
                Include Section Titles
              </label>
            </div>
            <div className="flex gap-2">
              <Checkbox
                checked={settings.textShadow}
                id="textShadow"
                onCheckedChange={(checked: boolean) => {
                  setSettings({ ...settings, textShadow: checked });
                }}
              />
              <label
                htmlFor="textShadow"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {" "}
                Text Shadow
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfLines">Number of Lines Per Slide</Label>
            <Select
              value={settings.linesPerSlide}
              onValueChange={(value) => {
                setSettings({ ...settings, linesPerSlide: value });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {numberOfLinesOptions.map((option, index) => (
                  <SelectItem key={option} value={option}>
                    {index === 0 ? "All" : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <input
                value={settings.backgroundColor}
                type="color"
                name="backgroundColor"
                className="style1 "
                onChange={(e) => {
                  setSettings({ ...settings, backgroundColor: e.target.value });
                }}
              />
              <label
                htmlFor="backgroundColor"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Background Color
              </label>
            </div>
            <div className="flex gap-4 items-center">
              <input
                value={settings.textColor}
                type="color"
                name="textColor"
                className="style1 "
                onChange={(e) => {
                  setSettings({ ...settings, textColor: e.target.value });
                }}
              />
              <label
                htmlFor="textColor"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Text Color
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fontSelect">Font</label>
            <Select
              name="fontSelect"
              onValueChange={(value) => {
                setSettings({ ...settings, fontFamily: value });
              }}
              value={settings.fontFamily}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsBox;
