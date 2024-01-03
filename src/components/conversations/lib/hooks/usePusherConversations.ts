import { pusherClient } from "@/lib/pusher/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type UsePusherConversationsProps = {
  currentUserId: string;
  query: string | null;
};

export const usePusherConversations = ({
  currentUserId,
  query,
}: UsePusherConversationsProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    pusherClient.subscribe(currentUserId);

    const handleNewConversation = () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", "list"] });
    };

    const handleNewMessage = () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", "list"] });
    };

    pusherClient.bind("conversation:new", handleNewConversation);
    pusherClient.bind("conversation:new_message", handleNewMessage);

    return () => {
      pusherClient.unsubscribe(currentUserId);
      pusherClient.unbind("conversation:new", handleNewConversation);
      pusherClient.unbind("conversation:new_message", handleNewMessage);
    };
  }, [currentUserId, queryClient, query]);
};
