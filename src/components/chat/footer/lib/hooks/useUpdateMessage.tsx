import { Message } from "@/components/chat/lib/types";
import { FormMessage } from "@/components/common";
import { Conversation } from "@/components/conversations/lib/types";
import { updateMessage } from "@/lib/actions/messages/mutations";
import { useToast } from "@/lib/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

let isLast = false;

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateMessage,
    onMutate: ({ conversationId, id, ...data }) => {
      queryClient.cancelQueries({
        queryKey: ["messages", conversationId],
      });

      queryClient.cancelQueries({
        queryKey: ["conversations"],
      });

      const previousMessagesData = queryClient.getQueryData([
        "messages",
        conversationId,
      ]);

      queryClient.setQueryData(
        ["messages", conversationId],
        (oldData: Message[]) => {
          return oldData.map((message, index) => {
            if (message.id === id) {
              if (index === oldData.length - 1) {
                isLast = true;
              }

              return { ...message, ...data };
            }

            return message;
          });
        }
      );

      toast({
        description: (
          <FormMessage type="success" message="Message updated successfully" />
        ),
      });

      let previousConversationsData;

      if (isLast) {
        previousConversationsData = queryClient.getQueriesData({
          queryKey: ["conversations"],
        });

        queryClient.setQueriesData(
          {
            queryKey: ["conversations"],
          },
          (oldData: Conversation[] | undefined) => {
            if (!oldData) return [];

            return oldData.map((conversation) => {
              if (conversation.id === conversationId) {
                return {
                  ...conversation,
                  lastMessage: {
                    ...conversation.lastMessage,
                    ...data,
                    updatedAt: new Date(),
                  },
                } as Conversation;
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
        ["messages", conversationId],
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

      toast({
        description: (
          <FormMessage type="error" message="Failed to update message" />
        ),
      });
    },
    onSettled: (_data, _error, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
        stale: true,
      });

      if (isLast) {
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        });
      }
    },
  });
};
