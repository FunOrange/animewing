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
    (t) => t.Start <= currentSeconds && t.End >= currentSeconds,
  );

  const { showSubtitles } = useKeyboardControls(videoRef);

  return (
    <>
      <section className="top-0 flex justify-center w-full bg-dusk-700/70 h-16 border-b border-dusk-900 backdrop-blur-sm shadow-md">
        <div className="max-w-screen-xl w-full flex items-center px-2">
          <h1 className="w-full text-3xl">
            <span className="text-dusk-200">ani</span>mewing
          </h1>
        </div>
      </section>

      <div
        className="w-full max-w-screen-xl grid h-screen"
        style={{ gridTemplateColumns: "200px 1fr" }}
      >
        {/* episode list */}
        <section className="border-r border-dusk-800 shadow-md overflow-y-auto">
          <div className="bg-black/50 p-2">Episode List</div>
          {new Array(24).fill(0).map((_, i) => (
            <div
              key={i}
              className={cn(
                "px-2 py-1 cursor-pointer hover:bg-dusk-300/30 transition-colors",
                i % 2 === 0 && "bg-dusk-800",
                i === episode - 1 &&
                  "text-dusk-800 bg-pink-300 hover:bg-pink-300 cursor-default",
              )}
              onClick={() => setEpisode(i + 1)}
            >
              Episode {i + 1}
            </div>
          ))}
        </section>

        <div className="flex flex-col">
          {/* breadcrumb */}
          <div className="self-start flex items-center gap-2 px-4 py-2">
            <div>Welcome to the NHK</div>
            <div>/</div>
            <div>Episode {episode}</div>
          </div>

          {/* video player */}
          <div className="relative">
            {/* subtitle overlay */}
            {showSubtitles && (
              <div className="absolute z-10 bottom-8 w-full flex flex-col gap-2 items-center">
                {currentSubtitles
                  ?.sort((a, b) => b.MarginV - a.MarginV)
                  ?.map((subtitle, i) => (
                    <div
                      className="text-center bg-black px-2 py-4 text-3xl rounded max-w-[80%] min-w-[55%]"
                      key={i}
                    >
                      {subtitle.Text}
                    </div>
                  ))}
              </div>
            )}

            <video ref={videoRef} controls width="100%" />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
