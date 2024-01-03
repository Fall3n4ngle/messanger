import { pusherClient } from "@/lib/pusher/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDeleteMessage } from "./useDeleteMessage";
import { DeleteMessage } from "@/lib/actions/messages/mutations";
import { useAuth } from "@clerk/nextjs";
import { useMessageForm } from "@/components/chat/lib/store/useMessageForm";
import { useReceiveMessage } from "./useReceiveMessage";
import { Message } from "../types";

export const usePusherMessages = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { updateCache: deleteMessage } = useDeleteMessage();
  const { updateCache: receiveMessage } = useReceiveMessage();

  const { setMessage } = useMessageForm();

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const handleNewMessage = (message: Message) => {
      receiveMessage({
        conversationId,
        message,
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

      setMessage({ id: undefined, file: "", content: "" });
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
  }, [
    conversationId,
    queryClient,
    setMessage,
    deleteMessage,
    userId,
    receiveMessage,
  ]);
};
