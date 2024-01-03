import { pusherClient } from "@/lib/pusher/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDeleteMessage } from "./useDeleteMessage";
import { DeleteMessage } from "@/lib/actions/messages/mutations";
import { useAuth } from "@clerk/nextjs";
import { Message } from "../types";
import { useNewMessage } from "@/components/chat/lib/hooks/useNewMessage";

export const usePusherMessages = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { updateCache: deleteMessage } = useDeleteMessage();
  const { updateCache: receiveMessage } = useNewMessage();

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const handleNewMessage = (newMessage: Message) => {
      receiveMessage({
        conversationId,
        newMessage,
      });
    };

    const handleDeleteMessage = ({ messageId, clerkId }: DeleteMessage) => {
      if (!userId || userId === clerkId) return;

      deleteMessage({
        messageId,
        conversationId,
      });
    };

    const handleUpdateMessage = () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
    };

    pusherClient.bind("messages:new", handleNewMessage);
    pusherClient.bind("messages:delete", handleDeleteMessage);
    pusherClient.bind("messages:update", handleUpdateMessage);
    pusherClient.bind("messages:seen", handleUpdateMessage);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", handleNewMessage);
      pusherClient.unbind("messages:delete", handleDeleteMessage);
      pusherClient.unbind("messages:update", handleUpdateMessage);
      pusherClient.unbind("messages:seen", handleUpdateMessage);
    };
  }, [conversationId, queryClient, deleteMessage, userId, receiveMessage]);
};
