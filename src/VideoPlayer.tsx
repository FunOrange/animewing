import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function M3U8Player({ m3u8Url }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  console.log("m3u8Url", m3u8Url);

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

  return <video ref={videoRef} controls width="100%" />;
}
