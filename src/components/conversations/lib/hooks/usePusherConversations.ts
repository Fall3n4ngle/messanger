import { pusherClient } from "@/lib/pusher/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNewConversation } from "./useNewConversation";
import { Conversation } from "../types";
import { useDeleteConversation } from "./useDeleteConversation";
import { usePathname, useRouter } from "next/navigation";
import { DeleteMemberEvent } from "@/lib/actions/member/mutations";
import { revalidateConversationPath } from "@/lib/actions/conversation/mutations";

type UsePusherConversationsProps = {
  currentUserId: string;
  query: string | null;
};

export const usePusherConversations = ({
  currentUserId,
  query,
}: UsePusherConversationsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { updateCache: addConversation } = useNewConversation();
  const { updateCache: deleteConversation } = useDeleteConversation();

  useEffect(() => {
    pusherClient.subscribe(currentUserId);

    const handleNewConversation = (newConversation: Conversation) => {
      addConversation(newConversation);
    };

    const handleDeleteMember = async ({
      conversationId,
      userId,
    }: DeleteMemberEvent) => {
      if (currentUserId !== userId) {
        await revalidateConversationPath(conversationId);
        return;
      }

      deleteConversation(conversationId);

      if (pathname.includes(conversationId)) {
        router.push("/conversations");
      }
    };

    const handleNewMessage = () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    pusherClient.bind("conversation:new", handleNewConversation);
    pusherClient.bind("conversation:new_message", handleNewMessage);
    pusherClient.bind("member:delete", handleDeleteMember);

    return () => {
      pusherClient.unsubscribe(currentUserId);
      pusherClient.unbind("conversation:new", handleNewConversation);
      pusherClient.unbind("conversation:new_message", handleNewMessage);
      pusherClient.unbind("member:delete", handleDeleteMember);
    };
  }, [
    currentUserId,
    queryClient,
    query,
    addConversation,
    deleteConversation,
    pathname,
    router,
  ]);
};
