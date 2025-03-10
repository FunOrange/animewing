import { RefObject, useEffect, useState } from "react";

export default function useKeyboardControls(
  videoRef: RefObject<HTMLVideoElement | null>,
) {
  const [showSubtitles, setShowSubtitles] = useState(true);
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Control") setShowSubtitles(false);
    };
    const keyup = (e: KeyboardEvent) => {
      if (e.key === "Control") setShowSubtitles(true);
    };
    const keypress = (e: KeyboardEvent) => {
      if (e.key === " " && document.activeElement !== videoRef.current) {
        if (videoRef.current?.paused) {
          videoRef.current?.play();
        } else if (!videoRef.current?.paused) {
          videoRef.current?.pause();
        }
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
  }, []);

  return { showSubtitles };
}
