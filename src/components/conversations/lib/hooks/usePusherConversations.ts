import { pusherClient } from "@/lib/pusher/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNewConversation } from "./useNewConversation";
import { Conversation } from "../types";

type UsePusherConversationsProps = {
  currentUserId: string;
  query: string | null;
};

export const usePusherConversations = ({
  currentUserId,
  query,
}: UsePusherConversationsProps) => {
  const queryClient = useQueryClient();
  const { updateCache: addConversation } = useNewConversation();

  useEffect(() => {
    pusherClient.subscribe(currentUserId);

    const handleNewConversation = (newConversation: Conversation) => {
      addConversation(newConversation);
    };

    const handleNewMessage = () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    pusherClient.bind("conversation:new", handleNewConversation);
    pusherClient.bind("conversation:new_message", handleNewMessage);

    return () => {
      pusherClient.unsubscribe(currentUserId);
      pusherClient.unbind("conversation:new", handleNewConversation);
      pusherClient.unbind("conversation:new_message", handleNewMessage);
    };
  }, [currentUserId, queryClient, query, addConversation]);
};
