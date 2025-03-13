import { useEffect, useState } from "react";

interface UseRememberProgressArgs {
  anime: string;
  currentEpisode: number;
  currentSeconds: number;
}
export default function useRememberProgress(args: UseRememberProgressArgs) {
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
}
