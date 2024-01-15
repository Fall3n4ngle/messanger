import { pusherClient } from "@/lib/pusher/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDeleteConversation } from "./useDeleteConversation";
import { usePathname, useRouter } from "next/navigation";
import { DeleteMemberEvent } from "@/lib/actions/member/mutations";
import {
  AddMembersEvent,
  UpdateConversationEvent,
  revalidateConversationPath,
} from "@/lib/actions/conversation/mutations";
import { useUpdateConversation } from "./useUpdateConversation";

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

  const { updateCache: deleteConversation } = useDeleteConversation();
  const { updateCache: updateConversation } = useUpdateConversation();

  useEffect(() => {
    pusherClient.subscribe(currentUserId);

    const handleNewConversation = () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"]
      })
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

    const handleConversationUpdate = async (
      updatedConversation: UpdateConversationEvent
    ) => {
      updateConversation(updatedConversation);
      await revalidateConversationPath(updatedConversation.id);
    };

    const handleAddMembers = async ({ conversationId }: AddMembersEvent) => {
      await revalidateConversationPath(conversationId);
    };

    const handleNewMessage = () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    pusherClient.bind("conversation:new", handleNewConversation);
    pusherClient.bind("member:delete", handleDeleteMember);
    pusherClient.bind("conversation:update", handleConversationUpdate);
    pusherClient.bind("conversation:new_message", handleNewMessage);
    pusherClient.bind("conversation:add_members", handleAddMembers);

    return () => {
      pusherClient.unsubscribe(currentUserId);
      pusherClient.unbind("conversation:new", handleNewConversation);
      pusherClient.unbind("conversation:new_message", handleNewMessage);
      pusherClient.unbind("member:delete", handleDeleteMember);
      pusherClient.unbind("conversation:update", handleConversationUpdate);
      pusherClient.unbind("conversation:add_members", handleAddMembers);
    };
  }, [
    currentUserId,
    queryClient,
    query,
    deleteConversation,
    pathname,
    router,
    updateConversation,
  ]);
};
