import useSWR from "swr";
import { pad2 } from "../utils";

export interface Subtitle {
  start: number;
  end: number;
  text: string;
  tokens: Token[];
}

export interface Token {
  id: number;
  start: number;
  end: number;
  surface: string;
  class: string;
  pos: string[];
  base_form: string;
  reading: string;
  pronunciation: string;
  features: string[];
}

export default function useSubtitle({
  anime,
  episode,
}: {
  anime: string;
  episode: number;
}) {
  const path = `/subs/${anime}/${anime}-${pad2(episode)}.json`;
  const { data } = useSWR<Subtitle[]>(
    path,
    () => fetch(path).then((res) => res.json()),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: Infinity,
    },
  );
  return data;
}
