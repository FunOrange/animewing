import React, { useEffect, useRef } from "react";
import { useState } from "react";
import "./App.css";
import { cn } from "./utils";
import useHls from "./hooks/hls";
import useCurrentVideoTime from "./hooks/current-video-time";
import useTranscript from "./hooks/transcript";
import useKeyboardControls from "./hooks/keyboard-controls";

function App() {
  const [episode, _setEpisode] = useState(1);
  const setEpisode = (episode: number) => {
    _setEpisode(episode);
  };

  const m3u8Url = `https://hlsx3cdn.echovideo.to/welcome-to-the-nhk/${episode}/master.m3u8`;
  const videoRef = useHls(m3u8Url);
  const currentSeconds = useCurrentVideoTime(videoRef);

  const transcript = useTranscript({ anime: "nhk-ni-youkoso", episode });
  const currentSubtitles = transcript?.filter(
    (t) => t.Start <= currentSeconds && t.End >= currentSeconds
  );

  const { showSubtitles } = useKeyboardControls(videoRef, transcript);

  return (
    <>
      <section className="top-0 flex justify-center w-full h-16 border-b shadow-md bg-dusk-700/70 border-dusk-900 backdrop-blur-sm">
        <div className="flex items-center w-full px-2 max-w-screen-2xl">
          <h1 className="w-full text-3xl">
            <span className="text-dusk-200">ani</span>mewing
          </h1>
        </div>
      </section>

      <div className="grid w-full h-screen max-w-screen-2xl grid-cols-[44px_1fr] lg:grid-cols-[140px_1fr]">
        {/* episode list */}
        <section className="overflow-y-auto border-r shadow-md border-dusk-800">
          <div className="hidden p-2 lg:block bg-black/50 line-clamp-1">Episode List</div>
          {new Array(24).fill(0).map((_, i) => (
            <div
              key={i}
              className={cn(
                "px-2 py-1 line-clamp-1 cursor-pointer hover:bg-dusk-300/30 transition-colors",
                i % 2 === 0 && "bg-dusk-800",
                i === episode - 1 && "text-dusk-800 bg-pink-300 hover:bg-pink-300 cursor-default"
              )}
              onClick={() => setEpisode(i + 1)}
            >
              <span className="hidden lg:inline">Episode </span>
              {i + 1}
            </div>
          ))}
        </section>

        <div className="flex flex-col min-h-0">
          {/* breadcrumb */}
          <div className="flex items-center self-start gap-2 px-4 py-2">
            <div>Welcome to the NHK</div>
            <div>/</div>
            <div>Episode {episode}</div>
          </div>

          {/* video player */}
          <div className="relative">
            {/* subtitle overlay */}
            {showSubtitles && (
              <div className="absolute z-10 flex flex-col items-center w-full gap-2 pointer-events-none bottom-4 md:bottom-8 2xl:bottom-14">
                {currentSubtitles
                  ?.sort((a, b) => b.MarginV - a.MarginV)
                  ?.map((subtitle, i) => (
                    <div className="flex items-center gap-4 max-w-[80%] min-w-[55%]" key={i}>
                      {previousSubtitleHint}
                      <div className="w-full px-3 py-2 text-center text-white border-2 pointer-events-auto md:px-6 md:py-4 2xl:py-8 text-md md:text-xl xl:text-3xl 2xl:text-4xl border-dusk-500 bg-black/70 backdrop-blur-2xl rounded-xl ">
                        {subtitle.Text}
                      </div>
                      <div className="hidden w-16 lg:block" />
                    </div>
                  ))}
              </div>
            )}

            <video ref={videoRef} controls width="100%" />
          </div>

          <div className="p-4 overflow-y-auto">
            Controls:
            <ul>
              <li>Space: Play/Pause</li>
              <li>Shift: Pause</li>
              <li>S: Hide Subtitles</li>
              <li>A: Go to previous subtitle</li>
              <li>D: Go to next subtitle</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

const previousSubtitleHint = (
  <div className="items-center hidden gap-2 lg:flex">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      className="text-white drop-shadow-lg"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
      />
    </svg>
    <div
      className="flex items-center justify-center w-8 py-1 font-mono text-sm font-bold border-2 border-dusk-400 bg-dusk-800"
      style={{ boxShadow: "2px 2px #3b2a44 " }}
    >
      A
    </div>
  </div>
);

export default App;
