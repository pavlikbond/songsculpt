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

const numberOfLinesOptions = ["100", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const SettingsBox = ({ settings, setSettings, fontFamilies }: Props) => {
  return (
    <Card className="bg-slate-100">
      <CardHeader>
        <CardTitle className="text-center">Settings</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Checkboxes Section */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-1">Display Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.includeTitleSlide}
                  id="includeTitle"
                  onCheckedChange={(checked: boolean) => {
                    setSettings({ ...settings, includeTitleSlide: checked });
                  }}
                />
                <label
                  htmlFor="includeTitle"
                  className="text-sm font-medium leading-none cursor-pointer hover:text-gray-600 transition-colors"
                >
                  Include Title Slide
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.includeSectionTitles}
                  id="includeSectionTitles"
                  onCheckedChange={(checked: boolean) => {
                    setSettings({ ...settings, includeSectionTitles: checked });
                  }}
                />
                <label
                  htmlFor="includeSectionTitles"
                  className="text-sm font-medium leading-none cursor-pointer hover:text-gray-600 transition-colors"
                >
                  Include Section Titles
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.textShadow}
                  id="textShadow"
                  onCheckedChange={(checked: boolean) => {
                    setSettings({ ...settings, textShadow: checked });
                  }}
                />
                <label
                  htmlFor="textShadow"
                  className="text-sm font-medium leading-none cursor-pointer hover:text-gray-600 transition-colors"
                >
                  Text Shadow
                </label>
              </div>
            </div>
          </div>

          {/* Layout and Styling Section */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-1">Layout & Styling</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfLines">Lines Per Slide</Label>
                <Select
                  value={settings.linesPerSlide}
                  onValueChange={(value) => {
                    setSettings({ ...settings, linesPerSlide: value });
                  }}
                >
                  <SelectTrigger className="w-full">
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

              <div className="space-y-2">
                <Label htmlFor="fontSelect">Font</Label>
                <Select
                  name="fontSelect"
                  onValueChange={(value) => {
                    setSettings({ ...settings, fontFamily: value });
                  }}
                  value={settings.fontFamily}
                >
                  <SelectTrigger className="w-full">
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
          </div>

          {/* Colors Section */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-1">Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <input
                  value={settings.backgroundColor}
                  type="color"
                  name="backgroundColor"
                  className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                  onChange={(e) => {
                    setSettings({ ...settings, backgroundColor: e.target.value });
                  }}
                />
                <label
                  htmlFor="backgroundColor"
                  className="text-sm font-medium leading-none cursor-pointer hover:text-gray-600 transition-colors"
                >
                  Background Color
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  value={settings.textColor}
                  type="color"
                  name="textColor"
                  className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                  onChange={(e) => {
                    setSettings({ ...settings, textColor: e.target.value });
                  }}
                />
                <label
                  htmlFor="textColor"
                  className="text-sm font-medium leading-none cursor-pointer hover:text-gray-600 transition-colors"
                >
                  Text Color
                </label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsBox;
