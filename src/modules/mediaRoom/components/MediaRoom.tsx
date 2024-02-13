import "@livekit/components-styles";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import { Track } from "livekit-client";
import { Loader, ToastMessage } from "@/components";
import { useMember, useToast } from "@/common/hooks";

type Props = {
  conversationId: string;
  onDisconected: () => void;
};

export default function MediaRoom({ conversationId, onDisconected }: Props) {
  const { toast } = useToast();
  const { data: member } = useMember({ conversationId });

  const [token, setToken] = useState("");

  useEffect(() => {
    if (!member?.user.name) return;

    (async () => {
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${conversationId}&username=${member.user.name}`
        );
        const data = await resp.json();

        setToken(data.token);
      } catch {
        onDisconected();

        toast({
          description: (
            <ToastMessage type="error" message="Failed to join call" />
          ),
        });
      }
    })();
  }, [conversationId, member?.user.name]);

  if (token === "") {
    return <Loader />;
  }

  return (
    <LiveKitRoom
      video={false}
      audio={false}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ marginBottom: "2rem" }}
      onDisconnected={onDisconected}
    >
      <MyVideoConference />
      <RoomAudioRenderer />
      <ControlBar />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
