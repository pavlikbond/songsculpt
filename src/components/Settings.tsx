"use client";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "@/types";

type Props = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
};

const Settings = ({ settings, setSettings }: Props) => {
  return (
    <div className="rounded border-2 shadow p-6">
      <h1 className="text-center text-2xl font-semibold text-slate-600 mb-8">Settings</h1>
      <div className="flex flex-col gap-8">
        <div className="flex gap-4">
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
        <div className="flex gap-4">
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
        </div>
      </div>
    </div>
  );
};

export default Settings;
