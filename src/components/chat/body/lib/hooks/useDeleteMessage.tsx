import { deleteMessage } from "@/lib/actions/messages/mutations";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Message } from "../../../lib/types";
import { useToast } from "@/lib/hooks";
import { FormMessage } from "@/components/common";

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteMessage,

    onMutate: async ({ conversationId, messageId }) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", conversationId],
      });

      const previousMessagesData = queryClient.getQueryData([
        "messages",
        conversationId,
      ]);

      queryClient.setQueryData(
        ["messages", conversationId],
        ({ pages, pageParams }: InfiniteData<Message[], unknown>) => {
          let found = false;

          const newPages = pages.map((page) => {
            if (found) return page;

            return page.filter((message) => {
              if (message.id === messageId) {
                found = true;
                return false;
              }

              return true;
            });
          });

          return {
            pages: newPages,
            pageParams,
          };
        }
      );

      return { previousMessagesData };
    },

    onError: (_error, { conversationId }, context) => {
      queryClient.setQueryData(
        ["meesages", conversationId],
        context?.previousMessagesData
      );

      toast({
        description: (
          <FormMessage type="error" message="Error deleting message" />
        ),
      });
    },

    onSettled: (_data, _error, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
    },
  });
};
