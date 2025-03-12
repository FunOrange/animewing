import { useMemo } from "react";
import useSWR from "swr";

export default function useSubtitle(path: string) {
  const { data } = useSWR(path, () => fetch(path).then((res) => res.text()), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    dedupingInterval: Infinity,
  });

  // process subtitles
  const dialogue = useMemo(() => {
    if (path.endsWith(".ass")) {
      return processAss(data);
    } else if (path.endsWith(".srt")) {
      return processSrt(data);
    }
  }, [data]);

  return dialogue;
}

const processAss = (data?: string) =>
  data
    ?.split(/\r?\n/)
    ?.filter((line) => line.startsWith("Dialogue"))
    ?.map((line) => {
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
    ?.filter((e) => !e.Style.startsWith("OP_") && !e.Style.startsWith("ED_"));

const processSrt = (data?: string) =>
  data
    ?.trim()
    ?.split(/\r?\n\r?\n/) // Split by blank lines
    ?.map((block, i) => {
      const lines = block.split(/\r?\n/);
      const index = parseInt(lines[0], 10);
      const timeMatch = lines[1].match(
        /(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/,
      );
      if (!timeMatch) throw new Error("Invalid time format: " + lines[1]);
      const toSeconds = (time: string /* 00:00:00,000 */) => {
        const [h, m, s, ms] = time.split(/:|,/).map((x) => parseInt(x));
        return h * 3600 + m * 60 + s + ms / 1000;
      };
      return {
        index,
        Start: toSeconds(timeMatch[1]),
        End: toSeconds(timeMatch[2]),
        Text: lines.slice(2).join(" "),
      };
    });
const toSeconds = (time: string /* 0:01:43.83 */) => {
  const [h, m, s, cs] = time.split(/\.|:/).map((x) => parseInt(x));
  return h * 3600 + m * 60 + s + cs / 100;
};
