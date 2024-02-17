import { useMember, useToast } from "@/common/hooks";
import { Loader, ToastMessage } from "@/components";
import {
  ControlBar,
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MyVideoConference } from "./VideoConference";
import { env } from "@/lib/env.mjs";

type Props = {
  onDisconected: () => void;
};

export default function MediaRoom({ onDisconected }: Props) {
  const conversationId = useParams().conversationId as string;
  const { toast } = useToast();
  const { data: member } = useMember({ conversationId });

  const [token, setToken] = useState("");

  useEffect(() => {
    if (!member?.user.name) return;

    (async () => {
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${conversationId}&username=${member.user.name}`,
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
  }, [conversationId, member?.user.name, toast, onDisconected]);

  if (token === "") {
    return <Loader />;
  }

  return (
    <LiveKitRoom
      video={false}
      audio={false}
      token={token}
      serverUrl={env.NEXT_PUBLIC_LIVEKIT_URL}
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
