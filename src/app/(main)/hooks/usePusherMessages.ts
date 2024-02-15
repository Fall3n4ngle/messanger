import { conversationKeys, messageEvents, messageKeys } from "@/common/const";
import { getMessagesChannel } from "@/common/utils";
import { pusherClient } from "@/lib/pusher/client";
import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const usePusherMessages = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;
    const messagesCahannel = getMessagesChannel({ userId });
    pusherClient.subscribe(messagesCahannel);

    const handleMessageEvent = ({
      conversationId,
    }: {
      conversationId: string;
    }) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(conversationId),
      });

      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
    };

    pusherClient.bind(messageEvents.newMessage, handleMessageEvent);
    pusherClient.bind(messageEvents.deleteMessage, handleMessageEvent);
    pusherClient.bind(messageEvents.updateMessage, handleMessageEvent);
    pusherClient.bind(messageEvents.markAsSeen, handleMessageEvent);

    return () => {
      pusherClient.unsubscribe(messagesCahannel);
      pusherClient.unbind(messageEvents.newMessage, handleMessageEvent);
      pusherClient.unbind(messageEvents.deleteMessage, handleMessageEvent);
      pusherClient.unbind(messageEvents.updateMessage, handleMessageEvent);
      pusherClient.unbind(messageEvents.markAsSeen, handleMessageEvent);
    };
  }, [queryClient, userId]);
};
