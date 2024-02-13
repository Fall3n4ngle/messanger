import { pusherClient } from "@/lib/pusher/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { DeleteMemberEvent } from "@/common/types/events";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/common/hooks";
import { ToastMessage } from "@/components";
import { ConversationEvent } from "@/common/types";

export const usePusherConversations = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { userId: currentUserId } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUserId) return;

    const conversationsChannel = `${currentUserId}_conversations`;
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

    pusherClient.bind("conversation:new", handleNewConversation);
    pusherClient.bind("conversation:delete_member", handleDeleteMember);
    pusherClient.bind("conversation:update", handleConversationUpdate);
    pusherClient.bind("conversation:add_members", handleAddMembers);
    pusherClient.bind("conversation:update_member", handleMemberUpdate);

    return () => {
      pusherClient.unsubscribe(conversationsChannel);
      pusherClient.unbind("conversation:new", handleNewConversation);
      pusherClient.unbind("member:delete", handleDeleteMember);
      pusherClient.unbind("conversation:update", handleConversationUpdate);
      pusherClient.unbind("conversation:add_members", handleAddMembers);
      pusherClient.unbind("conversation:update_member", handleMemberUpdate);
    };
  }, [queryClient, currentUserId, router, toast, pathname]);
};
