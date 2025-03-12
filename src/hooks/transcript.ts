import { useMemo } from "react";
import useSWR from "swr";

export default function useSubtitle(path: string, lineEndings?: "crlf" | "lf") {
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
      return processSrt(data, lineEndings);
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
      const toSeconds = (time: string /* 0:01:43.83 */) => {
        const [h, m, s, cs] = time.split(/\.|:/).map((x) => parseInt(x));
        return h * 3600 + m * 60 + s + cs / 100;
      };
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

const blockSeparator = (lineEndings?: "crlf" | "lf") =>
  lineEndings === "lf" ? /\n\n/ : /\r?\n\r?\n/;
const lineSeparator = (lineEndings?: "crlf" | "lf") =>
  lineEndings === "lf" ? /\n/ : /\r?\n/;

const processSrt = (data?: string, lineEndings?: "crlf" | "lf") =>
  data
    ?.trim()
    ?.split(blockSeparator(lineEndings))
    ?.map((block) => {
      const [_index, _timestamp, ..._text] = block.split(
        lineSeparator(lineEndings),
      );
      const index = parseInt(_index, 10);
      const timeMatch = _timestamp.match(
        /(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/,
      );
      if (!timeMatch) throw new Error("Invalid time format: " + _timestamp);
      const toSeconds = (time: string /* 00:00:00,000 */) => {
        const [h, m, s, ms] = time.split(/:|,/).map((x) => parseInt(x));
        return h * 3600 + m * 60 + s + ms / 1000;
      };
      return {
        index,
        Start: toSeconds(timeMatch[1]),
        End: toSeconds(timeMatch[2]),
        Text: _text
          .map((s) => s.trim())
          .join("\n")
          .replace(/\{.+}/g, "")
          .replace(/\<.+?>/g, ""),
      };
    });
