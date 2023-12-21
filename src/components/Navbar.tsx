"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

//import { UserButton, useAuth } from "@clerk/nextjs";
export default function Navbar() {
  const [state, setState] = React.useState(false);
  //const { isLoaded, isSignedIn } = useAuth();

  const menus = [
    { title: "Home", path: "/" },
    { title: "Contact", path: "/contact" },
  ];

  return (
    <nav className=" w-full border-b md:border-0">
      <div className="items-center px-4 max-w-screen-md mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link href="/">
            <h1 className="text-3xl font-bold text-purple-600">SongSculpt</h1>
          </Link>
          <div className="md:hidden">
            <button
              className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
              onClick={() => setState(!state)}
            >
              {state ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <div className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${state ? "block" : "hidden"}`}>
          <ul className="justify-end items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
            {menus.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.path}
                  className="text-slate-800 font-semibold rounded p-2 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                >
                  {item.title}
                </Link>
              </li>
            ))}
            {/* {isLoaded && isSignedIn ? (
              <li>
                <UserButton />
              </li>
            ) : (
              <li>
                <Link href="/sign-in" className="bg-slate-200 p-2 rounded hover:text-indigo-600">
                  Sign In
                </Link>
              </li>
            )} */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
