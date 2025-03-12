import { match } from "ts-pattern";

export type Anime = "nhk-ni-youkoso" | "hotaru-no-haka" | "death-note";

export interface AnimeMetadata {
  m3u8: (episode: number) => string;
  title: string;
  subtitlePath: (episode: number) => string;
  episodes: number[];
  offsetY?: string;
}

export const listing: Record<Anime, AnimeMetadata> = {
  "nhk-ni-youkoso": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/welcome-to-the-nhk/${episode}/master.m3u8`,
    title: "Welcome to the NHK",
    subtitlePath: (episode: number) => {
      const episodeNumber = episode.toString().padStart(2, "0");
      return `/subs/nhk-ni-youkoso/Welcome to the NHK - ${episodeNumber} [DVDRip 1280x720 x264 FLAC].ass`;
    },
    episodes: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ],
    offsetY: "8%",
  },
  "hotaru-no-haka": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/grave-of-the-fireflies/${episode}/master.m3u8`,
    title: "Grave of the Fireflies",
    subtitlePath: () =>
      `/subs/hotaru-no-haka/(1988) Grave of the Fireflies~Hotaru no Haka (720p Blu-ray 8bit Dual Audio) [NoobSubs] [3E904CC4].srt`,
    episodes: [1],
  },
  "death-note": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/death-note/${episode}/master.m3u8`,
    title: "Death Note",
    subtitlePath: (episode: number) =>
      match(episode)
        .with(1, () => "/subs/death-note/Death.Note.S01E01.Rebirth.jpn.srt")
        .with(
          2,
          () => "/subs/death-note/Death.Note.S01E02.Confrontation.jpn.srt",
        )
        .with(3, () => "/subs/death-note/Death.Note.S01E03.Dealings.jpn.srt")
        .with(4, () => "/subs/death-note/Death.Note.S01E04.Pursuit.jpn.srt")
        .with(5, () => "/subs/death-note/Death.Note.S01E05.Tactics.jpn.srt")
        .with(6, () => "/subs/death-note/Death.Note.S01E06.Unraveling.jpn.srt")
        .with(7, () => "/subs/death-note/Death.Note.S01E07.Overcast.jpn.srt")
        .with(8, () => "/subs/death-note/Death.Note.S01E08.Glare.jpn.srt")
        .with(9, () => "/subs/death-note/Death.Note.S01E09.Encounter.jpn.srt")
        .with(10, () => "/subs/death-note/Death.Note.S01E10.Doubt.jpn.srt")
        .with(11, () => "/subs/death-note/Death.Note.S01E11.Assault.jpn.srt")
        .with(12, () => "/subs/death-note/Death.Note.S01E12.Love.jpn.srt")
        .with(13, () => "/subs/death-note/Death.Note.S01E13.Confession.jpn.srt")
        .with(14, () => "/subs/death-note/Death.Note.S01E14.Friend.jpn.srt")
        .with(15, () => "/subs/death-note/Death.Note.S01E15.Wager.jpn.srt")
        .with(16, () => "/subs/death-note/Death.Note.S01E16.Decision.jpn.srt")
        .with(17, () => "/subs/death-note/Death.Note.S01E17.Execution.jpn.srt")
        .with(18, () => "/subs/death-note/Death.Note.S01E18.Ally.jpn.srt")
        .with(19, () => "/subs/death-note/Death.Note.S01E19.Matsuda.jpn.srt")
        .with(20, () => "/subs/death-note/Death.Note.S01E20.Makeshift.jpn.srt")
        .with(
          21,
          () => "/subs/death-note/Death.Note.S01E21.Performance.jpn.srt",
        )
        .with(22, () => "/subs/death-note/Death.Note.S01E22.Guidance.jpn.srt")
        .with(23, () => "/subs/death-note/Death.Note.S01E23.Frenzy.jpn.srt")
        .with(24, () => "/subs/death-note/Death.Note.S01E24.Revival.jpn.srt")
        .with(25, () => "/subs/death-note/Death.Note.S01E25.Silence.jpn.srt")
        .with(26, () => "/subs/death-note/Death.Note.S01E26.Renewal.jpn.srt")
        .with(27, () => "/subs/death-note/Death.Note.S01E27.Abduction.jpn.srt")
        .with(28, () => "/subs/death-note/Death.Note.S01E28.Impatience.jpn.srt")
        .with(29, () => "/subs/death-note/Death.Note.S01E29.Father.jpn.srt")
        .with(30, () => "/subs/death-note/Death.Note.S01E30.Justice.jpn.srt")
        .with(31, () => "/subs/death-note/Death.Note.S01E31.Transfer.jpn.srt")
        .with(32, () => "/subs/death-note/Death.Note.S01E32.Selection.jpn.srt")
        .with(33, () => "/subs/death-note/Death.Note.S01E33.Scorn.jpn.srt")
        .with(34, () => "/subs/death-note/Death.Note.S01E34.Vigilance.jpn.srt")
        .with(35, () => "/subs/death-note/Death.Note.S01E35.Malice.jpn.srt")
        .with(36, () => "/subs/death-note/Death.Note.S01E36.1.28.jpn.srt")
        .with(37, () => "/subs/death-note/Death.Note.S01E37.New.World.jpn.srt")
        .otherwise(() => ""),
    episodes: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
    ],
    offsetY: "10%",
  },
};
