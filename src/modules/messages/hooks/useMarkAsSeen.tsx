import { useToast } from "@/common/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastMessage } from "@/components";
import { UserConversation } from "@/common/actions/conversation/queries";
import { markAsSeen } from "../actions/message";

export const useMarkAsSeen = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: markAsSeen,
    onMutate: async ({ conversationId, messageId }) => {
      await queryClient.cancelQueries({
        queryKey: ["conversations"],
      });

      const previousData = queryClient.getQueriesData({
        queryKey: ["conversations"],
      });

      queryClient.setQueriesData(
        {
          queryKey: ["conversations"],
        },
        (oldData: UserConversation[] | undefined) => {
          if (!oldData) return [];

          return oldData.map((conversation) => {
            if (conversation.id === conversationId) {
              return {
                ...conversation,
                messages: [
                  ...conversation.messages.filter(
                    (message) => message.id !== messageId
                  ),
                ],
              };
            }

            return conversation;
          });
        }
      );

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueriesData(
        {
          queryKey: ["conversations"],
        },
        context?.previousData
      );

      toast({
        description: (
          <ToastMessage type="error" message="Failed to mark message as seen" />
        ),
      });
    },
  });
};
