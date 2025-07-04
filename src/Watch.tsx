import React, { useEffect } from "react";
import { useState } from "react";
import { cn } from "./utils";
import useHls from "./hooks/hls";
import useCurrentVideoTime from "./hooks/current-video-time";
import useTranscript, { Token } from "./hooks/transcript";
import useKeyboardControls from "./hooks/keyboard-controls";
import { AnimeMetadata } from "./listing";
import { Link } from "react-router-dom";
import { match } from "ts-pattern";
import useRememberState from "./hooks/remember-state";
import Watch2Gether from "./Watch2Gether";
import Toast from "./Toast";
import { defaultTo } from "ramda";

export interface WatchProps {
  anime: string;
  metadata: AnimeMetadata;
}
export default function Watch({ anime, metadata }: WatchProps) {
  const [syntaxHighlightingEnabled, setSyntaxHighlightingEnabled] =
    useState<boolean>(
      JSON.parse(
        localStorage.getItem(`preferences.syntaxHighlightingEnabled`) ?? "null",
      ) ?? true,
    );
  const [currentEpisode, _setCurrentEpisode] = useState(
    (() => {
      const progress = localStorage.getItem(`progress.${anime}`);
      return progress ? JSON.parse(progress).episode : 1;
    })(),
  );
  const setCurrentEpisode = (episode: number) => _setCurrentEpisode(episode);

  const videoRef = useHls(metadata.m3u8(currentEpisode));
  const currentSeconds = useCurrentVideoTime(videoRef);
  useEffect(() => {
    const progress = localStorage.getItem(`progress.${anime}`) || "null";
    videoRef.current!.currentTime = JSON.parse(progress)?.seconds || 0;
    videoRef.current!.volume = parseFloat(
      localStorage.getItem(`preferences.volume`) ?? "1",
    );
  }, []);

  const initialUserOffset = defaultTo(
    0,
    Number(localStorage.getItem(`preferences.${anime}.offsetSeconds`)),
  );
  const [userOffset, setUserOffset] = useState(initialUserOffset);

  useRememberState({
    videoRef,
    anime,
    currentEpisode,
    currentSeconds,
    syntaxHighlightingEnabled,
    userOffset,
  });

  const transcript = (() => {
    const transcript = useTranscript({ anime, episode: currentEpisode });
    return transcript?.map((e) => ({
      ...e,
      start: e.start + (metadata.offsetSeconds ?? 0) + userOffset,
      end: e.end + (metadata.offsetSeconds ?? 0) + userOffset,
    }));
  })();
  const currentSubtitles = transcript?.filter(
    (t) => t.start <= currentSeconds && t.end >= currentSeconds,
  );

  const [toastMessage, setToastMessage] = useState<string | undefined>(
    (() => {
      if (!initialUserOffset) return undefined;
      const offsetString = initialUserOffset.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
      const desc = initialUserOffset < 0 ? "earlier" : "later";
      return `Subtitle offset: ${offsetString}s ${desc}`;
    })(),
  );
  const { showSubtitles, fullscreen, commands } = useKeyboardControls(
    videoRef,
    transcript,
    setUserOffset,
    setToastMessage,
  );

  const aspectRatio =
    metadata.aspectRatio === "4:3" ? "aspect-[4/3]" : "aspect-video";

  return (
    <div className="w-full lg:h-screen flex flex-col-reverse lg:flex-row lg:justify-center max-w-[1920px]">
      {/* episode list */}
      <section className="h-full lg:w-[120px] shrink-0 min-h-0 grid grid-rows-[auto_1fr_auto_auto] border-r shadow-md border-dusk-800">
        <div className="shrink-0 p-2 bg-dusk-600 text-sm text-pink-300 line-clamp-1 py-[11px]">
          Episode List
        </div>
        <div className="overflow-y-auto h-full border-dusk-800 min-h-0">
          <div className="">
            {metadata.episodes.map((episode, i) => (
              <div
                key={episode}
                className={cn(
                  "px-2 py-1 line-clamp-1 cursor-pointer hover:bg-dusk-300/30 transition-colors",
                  i % 2 === 0 && "bg-dusk-800",
                  i === currentEpisode - 1 &&
                    "text-dusk-800 bg-pink-300 hover:bg-pink-300 cursor-default",
                )}
                onClick={() => setCurrentEpisode(episode)}
              >
                <span className="hidden lg:inline">Episode </span>
                {episode}
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 p-2 bg-dusk-600 text-sm text-pink-300 line-clamp-1">
          Watch2Gether
        </div>
        <div className="overflow-y-auto h-full">
          <Watch2Gether
            anime={anime}
            currentEpisode={currentEpisode}
            setCurrentEpisode={setCurrentEpisode}
            currentSeconds={currentSeconds}
            videoRef={videoRef}
          />
        </div>
      </section>

      <div className="w-full flex flex-col min-h-0">
        <div className="flex flex-col lg:flex-row justify-between gap-2 px-4 py-2">
          {/* breadcrumb */}
          <div className="flex items-center gap-2 self-start">
            <Link
              to="/"
              className="text-inherit hover:text-pink-300 whitespace-nowrap"
            >
              Home
            </Link>
            <div>/</div>
            <div className="whitespace-nowrap">{metadata.title}</div>
            <div>/</div>
            <div className="whitespace-nowrap">Episode {currentEpisode}</div>
          </div>

          {/* controls */}
          <div className="flex flex-wrap lg:justify-end gap-x-2 gap-y-1">
            {keyboardShortcut(
              "F",
              "Toggle Fullscreen",
              commands.toggleFullscreen,
            )}
            {keyboardShortcut("SPACE", "Play/Pause", commands.playPause)}
            {keyboardShortcut("SHIFT", "Pause", commands.playPause)}
            {keyboardShortcut("S", "Hide Subtitles", commands.toggleSubtitles)}
            {keyboardShortcut(
              "A",
              "Prev subtitle",
              commands.goToPreviousSubtitle,
            )}
            {keyboardShortcut("D", "Next subtitle", commands.goToNextSubtitle)}
            {keyboardShortcut("-", "offset", commands.offsetSubtitlesEarlier)}
            {keyboardShortcut("+", "offset", commands.offsetSubtitlesLater)}
            {keyboardShortcut(null, "Toggle Colors", () =>
              setSyntaxHighlightingEnabled((prev) => !prev),
            )}
          </div>
        </div>

        {/* video player */}
        <div
          className={cn(
            "relative",
            fullscreen &&
              "flex justify-center items-center bg-black absolute top-0 left-0 w-screen h-screen",
          )}
        >
          {/* subtitle overlay */}
          {showSubtitles && (
            <div
              className={cn(
                "absolute z-10 w-full pointer-events-none max-h-screen",
                aspectRatio,
              )}
            >
              <div
                className="absolute z-10 flex flex-col items-center w-full gap-2"
                style={{ bottom: metadata.positionY ?? "10%" }}
              >
                {currentSubtitles
                  ?.sort((a, b) => (b as any).MarginV - (a as any).MarginV)
                  ?.map((subtitle, i) => (
                    <div
                      className="flex items-center gap-4 max-w-[85%] min-w-[65%]"
                      key={i}
                    >
                      {previousSubtitleHint}
                      <div className="w-full whitespace-pre-line px-3 py-2 text-center text-white border-2 pointer-events-auto md:px-6 md:py-4 2xl:py-8 text-md md:text-xl xl:text-3xl 2xl:text-4xl border-dusk-500 bg-black/70 backdrop-blur-2xl rounded-xl">
                        {subtitle.tokens.map((token, i) => (
                          <span
                            key={i}
                            className={cn(
                              syntaxHighlightingEnabled && posStyles(token.pos),
                            )}
                          >
                            {token.surface}
                          </span>
                        ))}
                        {/* {subtitle.text} */}
                      </div>
                      <div className="hidden w-16 lg:block" />
                    </div>
                  ))}
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            className={cn(
              "focus:outline-none focus:ring-0 max-h-screen",
              aspectRatio,
            )}
            controls
            width="100%"
          />
        </div>
      </div>

      <Toast message={toastMessage} />
    </div>
  );
}

const posStyles = (pos: Token["pos"]) =>
  match(pos)
    // nouns
    .with(["名詞", "一般", "*", "*"], () => "text-blue-400")
    .with(["名詞", "形容動詞語幹", "*", "*"], () => "text-blue-400")
    .with(["名詞", "副詞可能", "*", "*"], () => "text-blue-400")
    .with(["名詞", "代名詞", "一般", "*"], () => "text-blue-400")
    .with(["助詞", "副助詞／並立助詞／終助詞", "*", "*"], () => "text-blue-300")
    .with(["名詞", "非自立", "副詞可能", "*"], () => "text-blue-400")
    .with(["連体詞", "*", "*", "*"], () => "text-blue-300")
    .with(["名詞", "接尾", "一般", "*"], () => "text-blue-300")
    .with(["名詞", "サ変接続", "*", "*"], () => "text-blue-400")
    // adjectives/adverbs
    .with(["形容詞", "自立", "*", "*"], () => "text-pink-400")
    .with(["形容詞", "非自立", "*", "*"], () => "text-pink-400")
    .with(["副詞", "一般", "*", "*"], () => "text-pink-400")
    // verbs
    .with(["動詞", "自立", "*", "*"], () => "text-purple-400")
    .with(["助動詞", "*", "*", "*"], () => "text-purple-300")
    .with(["助詞", "接続助詞", "*", "*"], () => "text-purple-300")
    .with(["動詞", "接尾", "*", "*"], () => "text-purple-300")
    .with(["動詞", "非自立", "*", "*"], () => "text-purple-300")
    // particles
    .with(["助詞", "係助詞", "*", "*"], () => "text-orange-300")
    .with(["助詞", "格助詞", "一般", "*"], () => "text-orange-300")
    .with(["助詞", "連体化", "*", "*"], () => "text-orange-300")
    // names
    .with(["名詞", "固有名詞", "人名", "姓"], () => "text-emerald-300")
    .with(["名詞", "固有名詞", "地域", "一般"], () => "text-emerald-300")
    .with(["名詞", "固有名詞", "人名", "名"], () => "text-emerald-300")
    .otherwise(() => "text-dusk-50");

const keyboardShortcut = (key: string | null, text: string | null, command) => (
  <div
    className={cn(
      "flex items-center bg-dusk-500 border border-dusk-400 rounded text-xs",
      "cursor-pointer hover:brightness-125 transition-all select-none",
    )}
    onClick={command}
  >
    {key && (
      <div className="py-1 px-2 bg-dusk-700 font-mono text-dusk-100 rounded">
        {key}
      </div>
    )}
    {text && <div className="px-2">{text}</div>}
  </div>
);

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
        fillRule="evenodd"
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
