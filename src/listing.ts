export interface AnimeMetadata {
  m3u8: (episode: number) => string;
  title: string;
  subtitlePath: (episode: number) => string;
  episodes: number[];
  positionY?: string;
  offsetSeconds?: number;
}

export const listing: Record<string, AnimeMetadata> = {
  "nhk-ni-youkoso": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/welcome-to-the-nhk/${episode}/master.m3u8`,
    title: "Welcome to the NHK",
    subtitlePath: (episode: number) =>
      `/subs/nhk-ni-youkoso/Welcome to the NHK - ${pad2(episode)} [DVDRip 1280x720 x264 FLAC].ass`,
    episodes: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ],
    positionY: "8%",
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
      `/subs/death-note/Death.Note.S01E${pad2(episode)}.jpn.srt`,
    episodes: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
    ],
  },
  clannad: {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/clannad/${episode}/master.m3u8`,
    title: "Clannad",
    subtitlePath: (episode: number) =>
      `/subs/clannad/Clannad_${pad3(episode)}.ass`,
    episodes: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ],
    positionY: "5%",
    offsetSeconds: -0.4,
  },
  "clannad-after-story": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/clannad-after-story/${episode}/master.m3u8`,
    title: "Clannad After Story",
    subtitlePath: (episode: number) =>
      `/subs/clannad-after-story/Clannad_After_Story_${pad3(episode)}.ass`,
    episodes: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25,
    ],
    positionY: "5%",
    offsetSeconds: -0.2,
  },
  "shingeki-no-kyojin-s1": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/shingeki-no-kyojin/${episode}/master.m3u8`,
    title: "Attack on Titan - Season 1",
    subtitlePath: (episode: number) =>
      `/subs/shingeki-no-kyojin/Shingeki no Kyojin S1 - ${pad2(episode)}.ass`,
    episodes: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25,
    ],
    positionY: "5%",
  },
  "vinland-saga-s1": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/vinland-saga/${episode}/master.m3u8`,
    title: "Vinland Saga - Season 1",
    subtitlePath: (episode: number) =>
      `/subs/vinland-saga/[SFSM] Vinland Saga - ${pad2(episode)} - JPN.ass`,
    episodes: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ],
    positionY: "7%",
  },
  "sousou-no-frieren": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/sousou-no-frieren/${episode}/master.m3u8`,
    title: "Frieren: Beyond Journey's End",
    subtitlePath: (episode: number) =>
      `/subs/sousou-no-frieren/Frieren_.Beyond.Journey's.End.S01E${pad2(episode)}.WEBRip.Netflix.ja[cc].srt`,
    episodes: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26,
    ],
    offsetSeconds: -1.0,
    positionY: "7%",
  },
};

const pad2 = (episode: number) => episode.toString().padStart(2, "0");
const pad3 = (episode: number) => episode.toString().padStart(3, "0");
