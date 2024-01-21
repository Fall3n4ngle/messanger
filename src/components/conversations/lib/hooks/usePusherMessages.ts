import { pusherClient } from "@/lib/pusher/client";
import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const usePusherMessages = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;

    const messagesCahannel = `${userId}_messages`;

    pusherClient.subscribe(messagesCahannel);

    const handleMessageEvent = ({
      conversationId,
    }: {
      conversationId: string;
    }) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    pusherClient.bind("messages:new", handleMessageEvent);
    pusherClient.bind("messages:delete", handleMessageEvent);
    pusherClient.bind("messages:update", handleMessageEvent);
    pusherClient.bind("messages:seen", handleMessageEvent);

    return () => {
      pusherClient.unsubscribe(messagesCahannel);
      pusherClient.unbind("messages:new", handleMessageEvent);
      pusherClient.unbind("messages:delete", handleMessageEvent);
      pusherClient.unbind("messages:update", handleMessageEvent);
      pusherClient.unbind("messages:seen", handleMessageEvent);
    };
  }, [queryClient, userId]);
};
