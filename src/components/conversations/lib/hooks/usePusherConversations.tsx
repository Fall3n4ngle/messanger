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

type UsePusherConversationsProps = {
  currentUserId: string;
  query: string | null;
};

export const usePusherConversations = ({
  currentUserId,
  query,
}: UsePusherConversationsProps) => {
  const queryClient = useQueryClient();
  const { userId: currentClerkId } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    pusherClient.subscribe(currentUserId);

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
      if (userId !== currentClerkId) {
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
    currentClerkId,
    router,
    toast,
  ]);
};
