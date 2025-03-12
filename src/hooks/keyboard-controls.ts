import { RefObject, useEffect, useState } from "react";
import useTranscript from "./transcript";

export default function useKeyboardControls(
  videoRef: RefObject<HTMLVideoElement | null>,
  transcript: ReturnType<typeof useTranscript>,
) {
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

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
      } else if (e.key === "f") {
        if (fullscreen) {
          exitFullscreen();
        } else {
          requestFullscreen();
        }
        setFullscreen((prev) => !prev);
        e.stopPropagation();
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

  return { showSubtitles, fullscreen };
}

function requestFullscreen() {
  // Check if the document is in fullscreen mode
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen(); // For most browsers
    // @ts-ignore:next-line
  } else if (document.documentElement.mozRequestFullScreen) {
    // @ts-ignore:next-line
    document.documentElement.mozRequestFullScreen(); // Firefox
    // @ts-ignore:next-line
  } else if (document.documentElement.webkitRequestFullscreen) {
    // @ts-ignore:next-line
    document.documentElement.webkitRequestFullscreen(); // Safari
    // @ts-ignore:next-line
  } else if (document.documentElement.msRequestFullscreen) {
    // @ts-ignore:next-line
    document.documentElement.msRequestFullscreen(); // IE/Edge
  }
}

function exitFullscreen() {
  // Check if the document is in fullscreen mode
  if (document.exitFullscreen) {
    document.exitFullscreen(); // For most browsers
    // @ts-ignore:next-line
  } else if (document.mozCancelFullScreen) {
    // @ts-ignore:next-line
    document.mozCancelFullScreen(); // Firefox
    // @ts-ignore:next-line
  } else if (document.webkitExitFullscreen) {
    // @ts-ignore:next-line
    document.webkitExitFullscreen(); // Safari and Chrome
    // @ts-ignore:next-line
  } else if (document.msExitFullscreen) {
    // @ts-ignore:next-line
    document.msExitFullscreen(); // IE/Edge
  }
}
