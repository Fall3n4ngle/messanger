import { pusherClient } from "@/lib/pusher/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { DeleteMemberEvent } from "@/common/types/events";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/common/hooks";
import { ToastMessage } from "@/components";
import { ConversationEvent } from "@/common/types";
import { conversationEvents } from "@/common/const";
import { getConversationsChannel } from "@/common/utils";

export const usePusherConversations = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { userId: currentUserId } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUserId) return;

    const conversationsChannel = getConversationsChannel({
      userId: currentUserId,
    });

    pusherClient.subscribe(conversationsChannel);

    const handleNewConversation = () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", "list"],
      });
    };

    const handleDeleteMember = async ({
      conversationId,
      userId,
      conversationName,
    }: DeleteMemberEvent) => {
      if (userId !== currentUserId) {
        queryClient.invalidateQueries({
          queryKey: ["conversations", conversationId],
        });

        return;
      }

      router.push("/conversations");

      queryClient.invalidateQueries({
        queryKey: ["conversations", "list"],
      });

      toast({
        description: (
          <ToastMessage
            type="error"
            message={`You have been excluded from ${conversationName} group`}
          />
        ),
      });
    };

    const handleConversationUpdate = async ({
      conversationId,
    }: ConversationEvent) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", "list"],
      });

      queryClient.invalidateQueries({
        queryKey: ["conversations", conversationId],
      });
    };

    const handleAddMembers = async ({ conversationId }: ConversationEvent) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", conversationId],
      });
    };

    const handleMemberUpdate = async ({
      conversationId,
    }: ConversationEvent) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", conversationId],
      });

      queryClient.invalidateQueries({
        queryKey: ["member", conversationId, currentUserId],
      });
    };

    pusherClient.bind(
      conversationEvents.newConversation,
      handleNewConversation
    );

    pusherClient.bind(conversationEvents.deleteMember, handleDeleteMember);

    pusherClient.bind(
      conversationEvents.updateConversation,
      handleConversationUpdate
    );

    pusherClient.bind(conversationEvents.addMembers, handleAddMembers);

    pusherClient.bind(conversationEvents.updateMember, handleMemberUpdate);

    return () => {
      pusherClient.unsubscribe(conversationsChannel);

      pusherClient.unbind(
        conversationEvents.newConversation,
        handleNewConversation
      );

      pusherClient.unbind(conversationEvents.deleteMember, handleDeleteMember);

      pusherClient.unbind(
        conversationEvents.updateConversation,
        handleConversationUpdate
      );

      pusherClient.unbind(conversationEvents.addMembers, handleAddMembers);

      pusherClient.unbind(conversationEvents.updateMember, handleMemberUpdate);
    };
  }, [queryClient, currentUserId, router, toast, pathname]);
};
