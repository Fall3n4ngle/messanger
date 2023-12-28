import { pusherClient } from "@/lib/pusher/client";
import { useMessage } from "@/store/useMessage";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDeleteMessage } from "./useDeleteMessage";
import { DeleteMessage } from "@/lib/actions/messages/mutations";
import { useAuth } from "@clerk/nextjs";

export const usePusherMessages = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const queryClient = useQueryClient();
  const { setMessage } = useMessage();
  const { updateCache } = useDeleteMessage();
  const { userId } = useAuth();

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const handleMessageEvent = () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
    };

    const handleDeleteMessage = ({ messageId, clerkId }: DeleteMessage) => {
      if (!userId || userId === clerkId) return;

      updateCache({
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

    pusherClient.bind("messages:new", handleMessageEvent);
    pusherClient.bind("messages:delete", handleDeleteMessage);
    pusherClient.bind("messages:update", handleUpdateMessage);
    pusherClient.bind("messages:seen", handleUpdateMessage);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", handleMessageEvent);
      pusherClient.unbind("messages:delete", handleMessageEvent);
      pusherClient.unbind("messages:update", handleUpdateMessage);
      pusherClient.unbind("messages:seen", handleUpdateMessage);
    };
  }, [conversationId, queryClient, setMessage, updateCache, userId]);
};
