import { useToast } from "@/common/hooks";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ToastMessage } from "@/components";
import { UserConversation } from "@/common/actions/conversation/queries";
import { markAsSeen } from "../actions/message";
import { conversationKeys } from "@/common/const";

const mutationKey = ["messages", "mark_as_seen"];

export const useMarkAsSeen = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: markAsSeen,
    mutationKey,
    onMutate: async ({ conversationId, messageId }) => {
      await queryClient.cancelQueries({
        queryKey: conversationKeys.lists(),
      });

      const previousData = queryClient.getQueriesData({
        queryKey: conversationKeys.lists(),
      });

      queryClient.setQueriesData(
        {
          queryKey: conversationKeys.lists(),
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
                      (message) => message.id !== messageId,
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
        },
      );

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueriesData(
        {
          queryKey: conversationKeys.lists(),
        },
        context?.previousData,
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
          mutationKey,
        }) === 1
      ) {
        queryClient.invalidateQueries({
          queryKey: conversationKeys.lists(),
        });
      }
    },
  });
};
