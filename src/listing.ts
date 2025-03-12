export interface AnimeMetadata {
  m3u8: (episode: number) => string;
  title: string;
  subtitlePath: (episode: number) => string;
  episodes: number[];
  positionY?: string;
  offsetSeconds?: number;
  lineEndings?: "crlf" | "lf";
}

export const listing: Record<string, AnimeMetadata> = {
  "nhk-ni-youkoso": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/welcome-to-the-nhk/${episode}/master.m3u8`,
    title: "Welcome to the NHK",
    subtitlePath: (episode: number) =>
      `/subs/nhk-ni-youkoso/Welcome to the NHK - ${pad2(episode)} [DVDRip 1280x720 x264 FLAC].ass`,
    episodes: new Array(24).fill(1).map((_, i) => i + 1),
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
    episodes: new Array(37).fill(1).map((_, i) => i + 1),
  },
  clannad: {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/clannad/${episode}/master.m3u8`,
    title: "Clannad",
    subtitlePath: (episode: number) =>
      `/subs/clannad/Clannad_${pad3(episode)}.ass`,
    episodes: new Array(24).fill(1).map((_, i) => i + 1),
    positionY: "5%",
    offsetSeconds: -0.4,
  },
  "clannad-after-story": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/clannad-after-story/${episode}/master.m3u8`,
    title: "Clannad After Story",
    subtitlePath: (episode: number) =>
      `/subs/clannad-after-story/Clannad_After_Story_${pad3(episode)}.ass`,
    episodes: new Array(25).fill(1).map((_, i) => i + 1),
    positionY: "5%",
    offsetSeconds: -0.2,
  },
  "shingeki-no-kyojin-s1": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/shingeki-no-kyojin/${episode}/master.m3u8`,
    title: "Attack on Titan - Season 1",
    subtitlePath: (episode: number) =>
      `/subs/shingeki-no-kyojin/Shingeki no Kyojin S1 - ${pad2(episode)}.ass`,
    episodes: new Array(25).fill(1).map((_, i) => i + 1),
    positionY: "5%",
  },
  "vinland-saga-s1": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/vinland-saga/${episode}/master.m3u8`,
    title: "Vinland Saga - Season 1",
    subtitlePath: (episode: number) =>
      `/subs/vinland-saga/[SFSM] Vinland Saga - ${pad2(episode)} - JPN.ass`,
    episodes: new Array(24).fill(1).map((_, i) => i + 1),
    positionY: "7%",
  },
  "sousou-no-frieren": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/sousou-no-frieren/${episode}/master.m3u8`,
    title: "Frieren: Beyond Journey's End",
    subtitlePath: (episode: number) =>
      `/subs/sousou-no-frieren/Frieren_.Beyond.Journey's.End.S01E${pad2(episode)}.WEBRip.Netflix.ja[cc].srt`,
    episodes: new Array(26).fill(1).map((_, i) => i + 1),
    offsetSeconds: -1.0,
    positionY: "7%",
  },
  "steins-gate": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/steinsgate/${episode}/master.m3u8`,
    title: "Steins;Gate",
    subtitlePath: (episode: number) =>
      `/subs/steins-gate/STEINS;GATE.S01E${pad2(episode)}.JA.srt`,
    episodes: new Array(25).fill(1).map((_, i) => i + 1),
    offsetSeconds: -1.0,
    positionY: "7%",
  },
  monster: {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/monster/${episode}/master.m3u8`,
    title: "Monster",
    subtitlePath: (episode: number) =>
      `/subs/monster/Monster S01E${pad2(episode)}.srt`,
    episodes: new Array(74).fill(1).map((_, i) => i + 1),
    offsetSeconds: -1.0,
    positionY: "4%",
  },
  "hajime-no-ippo": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/hajime-no-ippo-/${episode}/master.m3u8`,
    title: "Hajime no Ippo",
    subtitlePath: (episode: number) =>
      `/subs/hajime-no-ippo/Hajime no Ippo - S01E${pad2(episode)}.jp.srt`,
    episodes: new Array(75).fill(1).map((_, i) => i + 1),
    offsetSeconds: -4.0,
    positionY: "4%",
    lineEndings: "lf",
  },
  "bocchi-the-rock": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/bocchi-the-rock/${episode}/master.m3u8`,
    title: "Bocchi the Rock",
    subtitlePath: (episode: number) =>
      `/subs/bocchi-the-rock/E${pad2(episode)}.srt`,
    episodes: new Array(12).fill(1).map((_, i) => i + 1),
    positionY: "5%",
  },
  "sword-art-online": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/sword-art-online/${episode}/master.m3u8`,
    title: "Sword Art Online",
    subtitlePath: (episode: number) =>
      `/subs/sword-art-online/Sword Art Online.S01E${pad2(episode)}.CC.ja.srt`,
    episodes: new Array(25).fill(1).map((_, i) => i + 1),
    positionY: "5%",
  },
  gosick: {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/gosick/${episode}/master.m3u8`,
    title: "Gosick",
    subtitlePath: (episode: number) =>
      `/subs/gosick/Gosick.S01E${pad2(episode)}.CC.ja.srt`,
    episodes: new Array(24).fill(1).map((_, i) => i + 1),
    positionY: "5%",
  },
};

const pad2 = (episode: number) => episode.toString().padStart(2, "0");
const pad3 = (episode: number) => episode.toString().padStart(3, "0");
