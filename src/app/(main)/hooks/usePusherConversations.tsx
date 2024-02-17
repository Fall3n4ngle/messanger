import { pusherClient } from "@/lib/pusher/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/common/hooks";
import { getConversationsChannel } from "@/common/utils";
import { ConversationEvent } from "@/common/types";
import { conversationEvents, conversationKeys } from "@/common/const";

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

    const handleConversation = ({ conversationId }: ConversationEvent) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(conversationId),
      });
    };

    const handleMember = ({ conversationId }: ConversationEvent) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(conversationId),
      });
    };

    pusherClient.bind(
      conversationEvents.updateConversation,
      handleConversation,
    );
    pusherClient.bind(conversationEvents.addMembers, handleMember);
    pusherClient.bind(conversationEvents.deleteMember, handleMember);
    pusherClient.bind(conversationEvents.changeMemberRole, handleMember);

    return () => {
      pusherClient.unsubscribe(conversationsChannel);
      pusherClient.unbind(
        conversationEvents.updateConversation,
        handleConversation,
      );
      pusherClient.unbind(conversationEvents.addMembers, handleMember);
      pusherClient.unbind(conversationEvents.deleteMember, handleMember);
      pusherClient.unbind(conversationEvents.changeMemberRole, handleMember);
    };
  }, [queryClient, currentUserId, router, toast, pathname]);
};
