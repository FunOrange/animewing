import { RefObject, useEffect, useState } from "react";
import useTranscript from "./transcript";

export default function useKeyboardControls(
  videoRef: RefObject<HTMLVideoElement | null>,
  transcript: ReturnType<typeof useTranscript>,
  setUserOffset: React.Dispatch<React.SetStateAction<number>>,
  setToastMessage: React.Dispatch<React.SetStateAction<string | undefined>>,
) {
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const commands = {
    toggleFullscreen: () => {
      if (fullscreen) {
        document.body.style.overflow = "auto";
        exitFullscreen();
      } else {
        document.body.scrollTo(0, 0);
        window.scrollTo(0, 0);
        document.documentElement.scrollTo(0, 0);
        document.body.style.overflow = "hidden";
        requestFullscreen();
      }
      setFullscreen((prev) => !prev);
    },
    playPause: () => {
      if (videoRef.current?.paused) {
        videoRef.current?.play();
      } else if (!videoRef.current?.paused) {
        videoRef.current?.pause();
      }
    },
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    hideSubtitles: () => setShowSubtitles(false),
    showSubtitles: () => setShowSubtitles(true),
    toggleSubtitles: () => setShowSubtitles((prev) => !prev),
    goToPreviousSubtitle: () => {
      const offset = 0.5;
      const previousDialogue = transcript
        ?.filter(
          (dialogue) =>
            dialogue.start < videoRef.current!.currentTime - offset || 0,
        )
        ?.sort((a, b) => b.start - a.start)[0];
      if (previousDialogue) {
        videoRef.current!.currentTime = previousDialogue.start;
      }
    },
    goToNextSubtitle: () => {
      const nextDialogue = transcript
        ?.filter(
          (dialogue) => dialogue.start > videoRef.current!.currentTime || 0,
        )
        ?.sort((a, b) => a.start - b.start)[0];
      if (nextDialogue) {
        videoRef.current!.currentTime = nextDialogue.start;
      }
    },
    offsetSubtitlesEarlier: () =>
      setUserOffset((prev) => {
        const offset = prev - 0.1;
        const desc = offset < 0 ? "earlier" : "later";
        setToastMessage(`Subtitle offset: ${offset.toFixed(1)}s ${desc}`);
        return offset;
      }),
    offsetSubtitlesLater: () =>
      setUserOffset((prev) => {
        const offset = prev + 0.1;
        const desc = offset < 0 ? "earlier" : "later";
        setToastMessage(`Subtitle offset: ${offset.toFixed(1)}s ${desc}`);
        return offset;
      }),
  };

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "s") commands.hideSubtitles();
      if (e.key === "Shift") commands.pause();
      if (e.key === "Escape") {
        document.body.style.overflow = "auto";
        exitFullscreen();
        setFullscreen(false);
      }
    };
    const keyup = (e: KeyboardEvent) => {
      if (e.key === "s") commands.showSubtitles();
      if (e.key === "Shift") commands.play();
    };
    const keypress = (e: KeyboardEvent) => {
      if (e.key === " " && document.activeElement !== videoRef.current) {
        commands.playPause();
        e.stopPropagation();
      } else if (e.key === "a") {
        commands.goToPreviousSubtitle();
        e.stopPropagation();
      } else if (e.key === "d") {
        commands.goToNextSubtitle();
        e.stopPropagation();
      } else if (e.key === "f") {
        commands.toggleFullscreen();
        e.stopPropagation();
      } else if (e.key === "-" || e.key === "_") {
        commands.offsetSubtitlesEarlier();
      } else if (e.key === "+" || e.key === "=") {
        commands.offsetSubtitlesLater();
      }
    };
    const fullscreenchange = () => {
      if (document.fullscreenElement === videoRef.current) {
        console.log("Video is in fullscreen mode");
        commands.toggleFullscreen();
        exitFullscreen();
      }
    };
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("keypress", keypress);
    document.addEventListener("fullscreenchange", fullscreenchange);
    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("keypress", keypress);
      document.removeEventListener("fullscreenchange", fullscreenchange);
    };
  }, [transcript?.length, fullscreen]);

  return { showSubtitles, fullscreen, commands };
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
  if (document.fullscreenElement) {
    document.exitFullscreen?.(); // For most browsers
  }
  // @ts-ignore:next-line
  document.mozCancelFullScreen?.(); // Firefox
  // @ts-ignore:next-line
  document.webkitExitFullscreen?.(); // Safari and Chrome
  // @ts-ignore:next-line
  document.msExitFullscreen?.(); // IE/Edge
}
