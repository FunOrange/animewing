import { RefObject, useEffect, useState } from "react";
import useTranscript from "./transcript";

export default function useKeyboardControls(
  videoRef: RefObject<HTMLVideoElement | null>,
  transcript: ReturnType<typeof useTranscript>,
) {
  const [showSubtitles, setShowSubtitles] = useState(true);
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Control") setShowSubtitles(false);
      if (e.key === "Shift") videoRef.current?.pause();
    };
    const keyup = (e: KeyboardEvent) => {
      if (e.key === "Control") setShowSubtitles(true);
      if (e.key === "Shift") videoRef.current?.play();
    };
    const keypress = (e: KeyboardEvent) => {
      if (e.key === " " && document.activeElement !== videoRef.current) {
        if (videoRef.current?.paused) {
          videoRef.current?.play();
        } else if (!videoRef.current?.paused) {
          videoRef.current?.pause();
        }
        e.stopPropagation();
      } else if (e.key === "a") {
        const offset = 0.5;
        const previousDialogue = transcript
          ?.filter(
            (dialogue) =>
              dialogue.Start < videoRef.current!.currentTime - offset || 0,
          )
          ?.sort((a, b) => b.Start - a.Start)[0];
        if (previousDialogue) {
          videoRef.current!.currentTime = previousDialogue.Start;
          e.stopPropagation();
        }
      } else if (e.key === "d") {
        const nextDialogue = transcript
          ?.filter(
            (dialogue) => dialogue.Start > videoRef.current!.currentTime || 0,
          )
          ?.sort((a, b) => a.Start - b.Start)[0];
        if (nextDialogue) {
          videoRef.current!.currentTime = nextDialogue.Start;
          e.stopPropagation();
        }
      }
    };
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("keypress", keypress);
    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("keypress", keypress);
    };
  }, [transcript?.length]);

  return { showSubtitles };
}
