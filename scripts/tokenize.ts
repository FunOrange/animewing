import { listing } from "../src/listing";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { pad2 } from "../src/utils";

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
        Text: Text.join(",")
          .replace(/\{.+?}/g, "")
          .replace(/\\N/g, "\n"),
      };
    })
    ?.filter((e) => !e.Style.startsWith("OP_") && !e.Style.startsWith("ED_"))
    ?.map((e) => ({
      start: e.Start,
      end: e.End,
      marginV: e.MarginV,
      text: e.Text,
      tokens: [],
    }));

const blockSeparator = (lineEndings?: "crlf" | "lf") =>
  lineEndings === "lf" ? /\n\n/ : /\r?\n\r?\n/;
const lineSeparator = (lineEndings?: "crlf" | "lf") =>
  lineEndings === "lf" ? /\n/ : /\r?\n/;

const processSrt = (data?: string, lineEndings?: "crlf" | "lf") =>
  data
    ?.trim()
    ?.split(blockSeparator(lineEndings))
    ?.map((block) => {
      const [_, _timestamp, ..._text] = block.split(lineSeparator(lineEndings));
      const timeMatch = _timestamp.match(
        /(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/,
      );
      if (!timeMatch) throw new Error("Invalid time format: " + _timestamp);
      const toSeconds = (time: string /* 00:00:00,000 */) => {
        const [h, m, s, ms] = time.split(/:|,/).map((x) => parseInt(x));
        return h * 3600 + m * 60 + s + ms / 1000;
      };
      return {
        start: toSeconds(timeMatch[1]),
        end: toSeconds(timeMatch[2]),
        marginV: 0,
        text: _text
          .map((s) => s.trim())
          .join("\n")
          .replace(/\{.+?}/g, "")
          .replace(/\<.+?>/g, ""),
        tokens: [],
      };
    });

async function tokenize(sentence: string) {
  // NOTE: run `kagome server` before running this script
  return await fetch("http://localhost:6060/tokenize", {
    method: "PUT",
    body: JSON.stringify({
      sentence,
      mode: "normal",
    }),
  })
    .then((res) => res.json())
    .then((data) => data.tokens);
}

async function main() {
  for (const [anime, metadata] of Object.entries(listing)) {
    if (!metadata.subtitlePath(1)) continue;

    for (const episode of metadata.episodes) {
      const metadata = listing[anime];

      const outputDir = join(".", "public", "subs", anime);
      const outputPath = join(outputDir, `${anime}-${pad2(episode)}.json`);
      if (existsSync(outputPath)) {
        console.log("Skipping: ", metadata.subtitlePath(episode));
        continue;
      }

      const inputPath = join(".", metadata.subtitlePath(episode));
      const data = readFileSync(inputPath, "utf8");
      const dialogue = (() => {
        if (inputPath.endsWith(".ass")) {
          return processAss(data);
        } else if (inputPath.endsWith(".srt")) {
          return processSrt(data, metadata.lineEndings);
        }
      })();
      console.log("Tokenizing ", metadata.subtitlePath(episode));
      for (const e of dialogue!) {
        e.tokens = await tokenize(e.text);
      }

      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }
      writeFileSync(outputPath, JSON.stringify(dialogue, null, 2));
    }
  }
}
main();
