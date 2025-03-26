import { useEffect } from "react";

interface UseRememberProgressArgs {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  anime: string;
  currentEpisode: number;
  currentSeconds: number;
  syntaxHighlightingEnabled: boolean;
}
export default function useRememberState(args: UseRememberProgressArgs) {
  useEffect(() => {
    if (args.currentSeconds > 5) {
      localStorage.setItem(
        `progress.${args.anime}`,
        JSON.stringify({
          episode: args.currentEpisode,
          seconds: args.currentSeconds,
        }),
      );
    }
  }, [Math.round(args.currentSeconds)]);

  useEffect(() => {
    localStorage.setItem(
      `preferences.volume`,
      (args.videoRef.current?.volume ?? 1).toString(),
    );
  }, [args.videoRef.current?.volume]);

  useEffect(() => {
    localStorage.setItem(
      `preferences.syntaxHighlightingEnabled`,
      JSON.stringify(args.syntaxHighlightingEnabled),
    );
  }, [args.syntaxHighlightingEnabled]);
}
