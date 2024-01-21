import { pusherClient } from "@/lib/pusher/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { DeleteMemberEvent } from "@/lib/actions/member/mutations";
import {
  AddMembersEvent,
  UpdateConversationEvent,
  revalidateConversationPath,
} from "@/lib/actions/conversation/mutations";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks";
import { FormMessage } from "@/components/common";

export const usePusherConversations = () => {
  const queryClient = useQueryClient();
  const { userId: currentUserId } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUserId) return;

    const conversationsChannel = `${currentUserId}_conversations`;
    pusherClient.subscribe(conversationsChannel);

    const handleNewConversation = () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    const handleDeleteMember = async ({
      conversationId,
      userId,
      conversationName,
    }: DeleteMemberEvent) => {
      if (userId !== currentUserId) {
        await revalidateConversationPath(conversationId);
        return;
      }

      router.push("/conversations");

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      toast({
        description: (
          <FormMessage
            type="error"
            message={`You have been excluded from ${conversationName} group`}
          />
        ),
      });
    };

    const handleConversationUpdate = async (
      updatedConversation: UpdateConversationEvent
    ) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      await revalidateConversationPath(updatedConversation.id);
    };

    const handleAddMembers = async ({ conversationId }: AddMembersEvent) => {
      await revalidateConversationPath(conversationId);
    };

    pusherClient.bind("conversation:new", handleNewConversation);
    pusherClient.bind("conversation:delete_member", handleDeleteMember);
    pusherClient.bind("conversation:update", handleConversationUpdate);
    pusherClient.bind("conversation:add_members", handleAddMembers);

    return () => {
      pusherClient.unsubscribe(conversationsChannel);
      pusherClient.unbind("conversation:new", handleNewConversation);
      pusherClient.unbind("member:delete", handleDeleteMember);
      pusherClient.unbind("conversation:update", handleConversationUpdate);
      pusherClient.unbind("conversation:add_members", handleAddMembers);
    };
  }, [queryClient, currentUserId, router, toast]);
};
