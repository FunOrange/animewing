import { RefObject, useEffect, useState } from "react";
import useTranscript from "./transcript";

export default function useKeyboardControls(
  videoRef: RefObject<HTMLVideoElement | null>,
  transcript: ReturnType<typeof useTranscript>,
) {
  const [showSubtitles, setShowSubtitles] = useState(true);
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "s") setShowSubtitles(false);
      if (e.key === "Shift") videoRef.current?.pause();
    };
    const keyup = (e: KeyboardEvent) => {
      if (e.key === "s") setShowSubtitles(true);
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
              dialogue.start < videoRef.current!.currentTime - offset || 0,
          )
          ?.sort((a, b) => b.start - a.start)[0];
        if (previousDialogue) {
          videoRef.current!.currentTime = previousDialogue.start;
          e.stopPropagation();
        }
      } else if (e.key === "d") {
        const nextDialogue = transcript
          ?.filter(
            (dialogue) => dialogue.start > videoRef.current!.currentTime || 0,
          )
          ?.sort((a, b) => a.start - b.start)[0];
        if (nextDialogue) {
          videoRef.current!.currentTime = nextDialogue.start;
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
