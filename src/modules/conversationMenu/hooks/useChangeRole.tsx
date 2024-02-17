import { useToast } from "@/common/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeMemberRole } from "../actions/member";
import { conversationKeys } from "@/common/const";
import { Conversation } from "@/common/actions/conversation/queries";
import { ToastMessage } from "@/components";

const mutationKey = ["member", "change_role"];

export const useChangeRole = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeMemberRole,
    mutationKey,
    onMutate: async ({ role: newRole, conversationId, memberId }) => {
      await queryClient.cancelQueries({
        queryKey: conversationKeys.detail(conversationId),
      });

      const previousConversationData = queryClient.getQueryData(
        conversationKeys.detail(conversationId),
      );

      queryClient.setQueryData(
        conversationKeys.detail(conversationId),
        (oldData: Conversation) => {
          return {
            ...oldData,
            members: oldData.members.map((member) => {
              if (member.id === memberId) {
                return { ...member, role: newRole };
              }

              return member;
            }),
          } as Conversation;
        },
      );

      toast({
        description: (
          <ToastMessage type="success" message="Role changed successfully" />
        ),
      });

      return { previousConversationData };
    },
    onError: (_error, { conversationId }, context) => {
      queryClient.setQueryData(
        conversationKeys.detail(conversationId),
        context?.previousConversationData,
      );

      toast({
        description: (
          <ToastMessage type="error" message="Failed to change role" />
        ),
      });
    },
    onSettled: (_success, _data, { conversationId }) => {
      if (
        queryClient.isMutating({
          mutationKey,
        }) === 1
      ) {
        queryClient.invalidateQueries({
          queryKey: conversationKeys.detail(conversationId),
        });
      }
    },
  });
};
