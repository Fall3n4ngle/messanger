import { pusherClient } from "@/lib/pusher/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type Props = {
  memberId: string;
  conversationId: string;
};

export const usePusherMessages = ({ memberId, conversationId }: Props) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    pusherClient.subscribe(memberId);

    const handleMessageEvent = () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
    };

    pusherClient.bind("messages:new", handleMessageEvent);
    pusherClient.bind("messages:delete", handleMessageEvent);
    pusherClient.bind("messages:update", handleMessageEvent);
    pusherClient.bind("messages:seen", handleMessageEvent);

    return () => {
      pusherClient.unsubscribe(memberId);
      pusherClient.unbind("messages:new", handleMessageEvent);
      pusherClient.unbind("messages:delete", handleMessageEvent);
      pusherClient.unbind("messages:update", handleMessageEvent);
      pusherClient.unbind("messages:seen", handleMessageEvent);
    };
  }, [memberId, queryClient, conversationId]);
};
