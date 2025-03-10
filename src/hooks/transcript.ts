import { useMemo } from "react";
import useSWR from "swr";
import { match } from "ts-pattern";

interface UseSubtitleArgs {
  anime: string;
  episode: number;
}
export default function useSubtitle(args: UseSubtitleArgs) {
  const episodeNumber = args.episode.toString().padStart(2, "0");
  const path = match(args.anime)
    .with(
      "nhk-ni-youkoso",
      () =>
        `/ass/nhk-ni-youkoso/Welcome to the NHK - ${episodeNumber} [DVDRip 1280x720 x264 FLAC].ass`,
    )
    .otherwise(() => "");
  const { data } = useSWR(path, () => fetch(path).then((res) => res.text()), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    dedupingInterval: Infinity,
  });

  // process subtitles
  const dialogue = useMemo(
    () =>
      data
        ?.split("\n")
        ?.filter((line) => line.startsWith("Dialogue"))
        ?.map((line) => {
          //Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
          const [
            Layer,
            Start,
            End,
            Style,
            Name,
            MarginL,
            MarginR,
            MarginV,
            Effect,
            ...Text
          ] = line.trim().split(",");
          return {
            Layer,
            Start: toSeconds(Start),
            End: toSeconds(End),
            Style,
            Name,
            MarginL: parseInt(MarginL),
            MarginR: parseInt(MarginR),
            MarginV: parseInt(MarginV),
            Effect,
            Text: Text.join(",").replace(/\{.+}/g, ""),
          };
        })
        ?.filter(
          (e) => !e.Style.startsWith("OP_") && !e.Style.startsWith("ED_"),
        ),
    [data],
  );

  return dialogue;
}

const toSeconds = (time: string /* 0:01:43.83 */) => {
  const [h, m, s, cs] = time.split(/\.|:/).map((x) => parseInt(x));
  return h * 3600 + m * 60 + s + cs / 100;
};
