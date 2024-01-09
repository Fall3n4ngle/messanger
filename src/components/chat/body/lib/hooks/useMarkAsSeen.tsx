import { Conversation } from "@/components/conversations/lib/types";
import { markAsSeen } from "@/lib/actions/messages/mutations";
import { useToast } from "@/lib/hooks";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { FormMessage } from "@/components/common";

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
        (oldData: InfiniteData<Conversation[], unknown> | undefined) => {
          if (!oldData) {
            return {
              pageParams: [],
              pages: [],
            };
          }

          const { pageParams, pages } = oldData;

          return {
            pageParams,
            pages: pages.map((page) => {
              let found = false;

              if (found) return page;

              return page.map((conversation) => {
                if (conversation.id === conversationId) {
                  found = true;

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
            }),
          };
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
          <FormMessage type="error" message="Failed to mark message as seen" />
        ),
      });
    },
  });
};
