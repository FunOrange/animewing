import { RefObject, useEffect, useState } from "react";

export default function useCurrentVideoTime(
  videoRef: RefObject<HTMLVideoElement | null>,
) {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(videoRef.current!.currentTime);
    }, 100);
    return () => clearInterval(interval);
  }, [videoRef]);

  return currentTime;
}
