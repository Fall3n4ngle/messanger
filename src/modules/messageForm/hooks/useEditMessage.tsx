import { ToastMessage } from "@/components";
import { editMessage } from "../actions/message";
import { useToast } from "@/common/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Message } from "@/common/actions/messages/queries";
import { UserConversation } from "@/common/actions/conversation/queries";

let isLast = false;

export const useEditMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: editMessage,
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
          <ToastMessage type="success" message="Message updated successfully" />
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
          (oldData: UserConversation[] | undefined) => {
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
                } as UserConversation;
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
          <ToastMessage type="error" message="Failed to update message" />
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
