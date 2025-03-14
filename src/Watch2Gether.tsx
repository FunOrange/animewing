import React, { useEffect, useRef, useState } from "react";
import { cn } from "./utils";
import { match } from "ts-pattern";
import { useNavigate } from "react-router-dom";

const buttonStyle = cn(
  "transition-colors bg-dusk-500 hover:bg-pink-400/90 border-none py-2 px-4 text-xs rounded-sm",
  "disabled:opacity-50 disabled:bg-dusk-500",
);

interface VideoState {
  anime: string;
  currentEpisode: number;
  currentSeconds: number;
  paused: boolean;
}

export interface Watch2GetherProps {
  anime: string;
  currentEpisode: number;
  setCurrentEpisode: (episode: number) => void;
  currentSeconds: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}
export default function Watch2Gether({
  anime,
  currentEpisode,
  setCurrentEpisode,
  currentSeconds,
  videoRef,
}: Watch2GetherProps) {
  const navigate = useNavigate();

  const [roomIdInput, setRoomIdInput] = useState<string>("");
  const [roomId, setRoomId] = useState<string>();
  const [isHost, setIsHost] = useState(false);
  const isViewer = !isHost;
  const [viewers, setViewers] = useState<number>(0);
  const roomVoluntarilyLeftRef = useRef<boolean>(false);

  const websocketRef = useRef<WebSocket>(null);

  const currentEpisodeRef = useRef<number>(currentEpisode);
  useEffect(() => {
    currentEpisodeRef.current = currentEpisode;
  }, [currentEpisode]);

  useEffect(() => {
    if (isHost) {
      const videoState: VideoState = {
        anime: anime,
        currentEpisode,
        currentSeconds: videoRef.current?.currentTime ?? 0,
        paused: videoRef.current?.paused ?? false,
      };
      websocketRef.current?.send("video-state " + JSON.stringify(videoState));
    }
  }, [
    roomId,
    isHost,
    anime,
    currentEpisode,
    currentSeconds,
    videoRef.current?.paused,
  ]);

  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.onclose = null;
        websocketRef.current.close();
      }
    };
  }, []);

  const createRoom = () => {
    websocketRef.current = new WebSocket(`ws://localhost:8888`);
    websocketRef.current.onopen = () => {
      websocketRef.current!.send("create-room");
    };
    websocketRef.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      match(message.type)
        .with("room-created", () => {
          setRoomId(message.roomId);
          setIsHost(true);
          setViewers(0);
        })
        .with("viewer-joined", () => setViewers((prev) => prev + 1))
        .with("viewer-left", () => setViewers((prev) => prev - 1))
        .otherwise(() => console.log("Unexpected message", message));
    };
    websocketRef.current.onclose = () => {
      setRoomId(undefined);
      setIsHost(false);
      setViewers(0);
      alert("Room closed");
    };
  };

  const joinRoom = () => {
    websocketRef.current = new WebSocket(`wss://funorange.ca`);
    websocketRef.current.onopen = () => {
      websocketRef.current!.send("join-room " + roomIdInput);
    };
    websocketRef.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      match(message.type)
        .with("room-joined", () => {
          setRoomIdInput("");
          setRoomId(message.roomId);
          setIsHost(false);
          setViewers(message.viewers);
        })
        .with("viewer-joined", () => setViewers((prev) => prev + 1))
        .with("viewer-left", () => setViewers((prev) => prev - 1))
        .with("video-state", () => {
          // sync video state with host
          const { type, ...host } = message as { type: string } & VideoState;
          if (anime !== host.anime) {
            navigate(`/${host.anime}`);
            return;
          }
          if (currentEpisodeRef.current !== host.currentEpisode) {
            setCurrentEpisode(host.currentEpisode);
          }
          if (
            Math.abs(videoRef.current!.currentTime - host.currentSeconds) > 0.5
          ) {
            videoRef.current!.currentTime = host.currentSeconds;
          }
          if (videoRef.current!.paused !== host.paused) {
            if (host.paused) {
              videoRef.current!.pause();
            } else {
              videoRef.current!.play();
            }
          }
        })
        .with("error", () => alert(JSON.stringify(message)))
        .otherwise(() => console.error("Unexpected message", message));
    };
    websocketRef.current.onclose = () => {
      setRoomId(undefined);
      setIsHost(false);
      setViewers(0);
      if (!roomVoluntarilyLeftRef.current) {
        alert("Room closed");
      }
      roomVoluntarilyLeftRef.current = false;
    };
  };

  const leaveRoom = () => {
    roomVoluntarilyLeftRef.current = true;
    websocketRef.current?.close();
    websocketRef.current = null;
    setRoomId(undefined);
    setIsHost(false);
    setViewers(0);
  };

  return (
    <div className="flex flex-col gap-1 p-1 text-sm">
      {!roomId && (
        <>
          <button className={buttonStyle} onClick={createRoom}>
            Create room
          </button>
          <div className="border-t my-1 border-dusk-500 w-full" />
          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Room ID"
              className="px-1 py-2 w-full rounded border border-dusk-500"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") joinRoom();
              }}
            />
            <button
              disabled={!roomIdInput}
              className={buttonStyle}
              onClick={joinRoom}
            >
              Join room
            </button>
          </div>
        </>
      )}
      {roomId && (
        <>
          <button
            className={cn(buttonStyle, "hover:bg-red-500/80")}
            onClick={leaveRoom}
          >
            Leave room
          </button>
          <div>Room ID: {roomId}</div>
          <div>👑 Host {isHost && "(you)"}</div>
          {new Array(viewers).fill(0).map((_, i) => (
            <div key={i}>👁 Viewer {i === 0 && isViewer && "(you)"}</div>
          ))}
        </>
      )}
    </div>
  );
}
