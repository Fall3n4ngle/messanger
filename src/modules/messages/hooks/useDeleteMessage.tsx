import { deleteMessage } from "../actions/message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/common/hooks";
import { ToastMessage } from "@/components";
import { Message } from "@/common/actions/messages/queries";
import { UserConversation } from "@/common/actions/conversation/queries";

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

      let previousMessage: UserConversation["lastMessage"] | null;

      queryClient.setQueryData(
        ["messages", conversationId],
        (oldData: Message[]) => {
          return oldData.filter((message, index) => {
            if (message.id === messageId) {
              if (index === oldData.length - 1) {
                isLast = true;
              }

              return false;
            }

            if (message.id === previousMessageId) {
              previousMessage = {
                _count: {
                  seenBy: message.seenBy.length,
                },
                content: message.content,
                id: message.id,
                user: message.user,
                updatedAt: message.updatedAt,
                file: message.file,
              };
            }

            return true;
          });
        }
      );

      let previousConversationsData;

      if (isLast) {
        previousConversationsData = queryClient.getQueriesData({
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
                return { ...conversation, lastMessage: previousMessage };
              }

              return conversation;
            });
          }
        );
      }

      toast({
        description: (
          <ToastMessage type="success" message="Message deleted successfully" />
        ),
      });

      return { previousMessagesData, previousConversationsData };
    },

    onError: (_error, { conversationId }, context) => {
      toast({
        description: (
          <ToastMessage type="error" message="Error deleting message" />
        ),
      });

      queryClient.setQueryData(
        ["meesages", conversationId],
        context?.previousMessagesData
      );

      if (isLast) {
        queryClient.setQueriesData(
          {
            queryKey: ["conversations"],
          },
          context?.previousConversationsData
        );
      }
    },

    onSettled: (_data, _error, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });

      if (isLast) {
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        });
      }
    },
  });
};
