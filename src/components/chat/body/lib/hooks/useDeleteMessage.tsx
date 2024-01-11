import { deleteMessage } from "@/lib/actions/messages/mutations";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Message } from "../../../lib/types";
import { useToast } from "@/lib/hooks";
import { FormMessage } from "@/components/common";
import {
  Conversation,
  LastMessage,
} from "@/components/conversations/lib/types";

let isLast = false;

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteMessage,

    onMutate: async ({ conversationId, messageId, previousMessageId }) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", conversationId],
      });

      await queryClient.cancelQueries({
        queryKey: ["conversations"],
      });

      const previousMessagesData = queryClient.getQueryData([
        "messages",
        conversationId,
      ]);

      const previousConversationsData = queryClient.getQueriesData({
        queryKey: ["conversations"],
      });

      let previousMessage: LastMessage | null;

      queryClient.setQueryData(
        ["messages", conversationId],
        ({ pages, pageParams }: InfiniteData<Message[], unknown>) => {
          let foundDelete = false;
          let foundPrevious = false;
          const lastPage = pages[pages.length - 1];
          isLast = messageId === lastPage[lastPage.length - 1].id;

          const newPages = pages.map((page) => {
            if ((foundDelete && !isLast) || foundDelete || foundPrevious)
              return page;

            return page.filter((message) => {
              if (message.id === previousMessageId) {
                foundPrevious = true;

                previousMessage = {
                  _count: {
                    seenBy: message.seenBy.length,
                  },
                  content: message.content,
                  id: message.id,
                  member: message.member,
                  updatedAt: message.updatedAt,
                  file: message.file,
                };
              }

              if (message.id === messageId) {
                foundDelete = true;

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

      if (isLast) {
        queryClient.setQueriesData(
          {
            queryKey: ["conversations"],
          },
          (oldData: Conversation[] | undefined) => {
            if (!oldData) return [];

            return oldData.map((conversation) => {
              if (conversation.id === conversationId) {
                return { ...conversation, lastMessage: previousMessage };
              }

              return conversation;
            });
          }
        );
      }

      return { previousMessagesData, previousConversationsData };
    },

    onError: (_error, { conversationId }, context) => {
      queryClient.setQueryData(
        ["meesages", conversationId],
        context?.previousMessagesData
      );

      queryClient.setQueriesData(
        {
          queryKey: ["conversations"],
        },
        context?.previousConversationsData
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

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};
