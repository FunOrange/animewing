import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function useHls(m3u8Url: string) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if the browser supports HLS.js
    if (Hls.isSupported()) {
      const hls = new Hls();

      // Bind the HLS.js instance to the video element
      hls.loadSource(m3u8Url);
      hls.attachMedia(videoRef.current!);

      // Clean up the HLS instance when the component is unmounted
      return () => hls.destroy();
    }

    // If HLS.js is not supported (e.g., Safari), fallback to native HLS support
    if (videoRef.current!.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current!.src = m3u8Url;
    }
  }, [m3u8Url]);

  return videoRef;
}
