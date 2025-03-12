import React, { useState } from "react";
import { listing } from "./listing";
import { Link } from "react-router-dom";

export default function Home() {
  const [searchString, setSearchString] = useState("");

  return (
    <div className="flex flex-col w-full h-screen max-w-screen-2xl">
      <div className="px-4 py-3">
        <h1 className="text-pink-300 text-2xl font-bold">welcome</h1>
        <p>
          Learn japanese with anime! We recommend installing{" "}
          <a href="https://yomitan.wiki/">yomitan</a> for quick dictionary
          lookups
        </p>
      </div>
      <div className="bg-black/50 p-2">
        <input
          className="w-full px-3 py-2 text-sm font-mono border-2 rounded-lg border-dusk-500 bg-dusk-900 max-w-[400px]"
          placeholder="Search..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </div>
      {Object.entries(listing)
        .sort((a, b) => a[1].title.localeCompare(b[1].title))
        .filter(([_, { title }]) =>
          title.toLowerCase().includes(searchString.toLowerCase()),
        )
        .map(([anime, { title }], i) => (
          <Link
            key={i}
            to={`/${anime}`}
            className="text-inherit overflow-y-auto border-r shadow-md border-dusk-800 hover:bg-dusk-400 hover:text-pink-300 transition-colors"
          >
            <div className="p-2 bg-black/50 line-clamp-1">{title}</div>
          </Link>
        ))}
    </div>
  );
}
