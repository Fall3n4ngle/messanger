import {
  availableMemberRoles,
  conversationKeys,
  memberEvents,
  memberKeys,
} from "@/common/const";
import { useToast } from "@/common/hooks";
import { ChangeRoleEvent, MemberEvent } from "@/common/types";
import { getMemberChannel } from "@/common/utils";
import { ToastMessage } from "@/components";
import { pusherClient } from "@/lib/pusher/client";
import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export const usePusherMember = () => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const conversationId = useParams().conversationId as string;

  useEffect(() => {
    if (!userId) return;
    const memberChannel = getMemberChannel({ userId });
    pusherClient.subscribe(memberChannel);

    const handleJoinConversation = ({ conversationName }: MemberEvent) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });

      toast({
        description: (
          <ToastMessage
            type="success"
            message={`You have just been added to ${conversationName} group `}
          />
        ),
      });
    };

    const handleLeaveConversation = ({ conversationName }: MemberEvent) => {
      if (conversationId) {
        router.push("/conversations");
      }

      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });

      toast({
        description: (
          <ToastMessage
            type="error"
            message={`You have just been excluded from ${conversationName} group `}
          />
        ),
      });
    };

    const handleChangeRole = ({
      conversationId,
      newRole,
      conversationName,
    }: ChangeRoleEvent) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(conversationId),
      });

      queryClient.invalidateQueries({
        queryKey: memberKeys.detail(conversationId),
      });

      const newRoleLabel = availableMemberRoles.find(
        (r) => r.value === newRole,
      );

      toast({
        description: (
          <ToastMessage
            type="success"
            message={`Your role in ${conversationName} has just been changed to ${newRoleLabel}`}
          />
        ),
      });
    };

    pusherClient.bind(memberEvents.join, handleJoinConversation);
    pusherClient.bind(memberEvents.leave, handleLeaveConversation);
    pusherClient.bind(memberEvents.changeRole, handleChangeRole);

    return () => {
      pusherClient.unsubscribe(memberChannel);
      pusherClient.unbind(memberEvents.join, handleJoinConversation);
      pusherClient.unbind(memberEvents.leave, handleLeaveConversation);
      pusherClient.unbind(memberEvents.changeRole, handleChangeRole);
    };
  }, [userId, queryClient, toast, router, conversationId]);
};
