export type Anime = "nhk-ni-youkoso" | "hotaru-no-haka";

export interface AnimeMetadata {
  m3u8: (episode: number) => string;
  title: string;
  subtitlePath: (episode: number) => string;
  episodes: number[];
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
  },
  "hotaru-no-haka": {
    m3u8: (episode: number) =>
      `https://hlsx3cdn.echovideo.to/grave-of-the-fireflies/${episode}/master.m3u8`,
    title: "Grave of the Fireflies",
    subtitlePath: () =>
      `/subs/hotaru-no-haka/(1988) Grave of the Fireflies~Hotaru no Haka (720p Blu-ray 8bit Dual Audio) [NoobSubs] [3E904CC4].srt`,
    episodes: [1],
  },
};
