"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [state, setState] = React.useState(false);

  const menus = [
    { title: "Home", path: "/" },
    { title: "Contact", path: "/contact" },
  ];

  return (
    <nav className="w-full border-b-2 border-[var(--color-accent)] bg-[var(--color-primary)]">
      <div className="items-center px-4 max-w-screen-md mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link href="/">
            <h1
              className="text-3xl font-bold text-[var(--color-accent-dark)]"
              style={{ fontFamily: "Pacifico, cursive" }}
            >
              SongSculpt
            </h1>
          </Link>
          <div className="md:hidden">
            <button
              className="text-[var(--color-accent-dark)] outline-none p-2 rounded-md focus:border-[var(--color-accent)] focus:border"
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
                  className="text-[var(--color-accent-dark)] font-semibold rounded p-2 hover:text-[var(--color-accent)] hover:bg-[var(--color-primary)] transition-all duration-200"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
