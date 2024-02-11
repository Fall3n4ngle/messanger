import { useToast } from "@/common/hooks";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ToastMessage } from "@/components";
import { UserConversation } from "@/common/actions/conversation/queries";
import { markAsSeen } from "../actions/message";

export const useMarkAsSeen = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: markAsSeen,
    mutationKey: ["messages", "mark_as_seen"],
    onMutate: async ({ conversationId, messageId }) => {
      await queryClient.cancelQueries({
        queryKey: ["conversations", "list"],
      });

      const previousData = queryClient.getQueriesData({
        queryKey: ["conversations", "list"],
      });

      queryClient.setQueriesData(
        {
          queryKey: ["conversations", "list"],
        },
        (oldData: InfiniteData<UserConversation[]> | undefined) => {
          if (!oldData)
            return {
              pageParams: [],
              pages: [],
            };
            
          const { pageParams, pages } = oldData;

          const newPages = pages.map((page) => {
            return page.map((conversation) => {
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
          });

          return {
            pages: newPages,
            pageParams,
          };
        }
      );

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueriesData(
        {
          queryKey: ["conversations", "list"],
        },
        context?.previousData
      );

      toast({
        description: (
          <ToastMessage type="error" message="Failed to mark message as seen" />
        ),
      });
    },
    onSettled: () => {
      if (
        queryClient.isMutating({
          mutationKey: ["messages", "mark_as_seen"],
        }) === 1
      ) {
        queryClient.invalidateQueries({
          queryKey: ["conversations", "list"],
        });
      }
    },
  });
};
