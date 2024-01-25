import { sendMessage } from "../actions/message";
import { useToast } from "@/common/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastMessage } from "@/components";
import { Message } from "@/common/actions/messages/queries";
import { UserConversation } from "@/common/actions/conversation/queries";

type Props = Pick<Message, "user">;

export const useSendMessage = ({ user }: Props) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: sendMessage,
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", data.conversationId],
      });

      await queryClient.cancelQueries({
        queryKey: ["conversations"],
      });

      const previousMessagesData = queryClient.getQueryData([
        "messages",
        data.conversationId,
      ]);

      const previousConversationsData = queryClient.getQueriesData({
        queryKey: ["conversations"],
      });

      queryClient.setQueryData(
        ["messages", data.conversationId],
        (oldData: Message[]) => {
          const newMessage: Message = {
            ...data,
            seenBy: [],
            user,
            file: data.file ?? "",
          };
          return [...oldData, newMessage];
        }
      );

      queryClient.setQueriesData(
        {
          queryKey: ["conversations"],
        },
        (oldData: UserConversation[] | undefined) => {
          if (!oldData) return [];

          const index = oldData.findIndex((c) => c.id === data.conversationId);

          if (index === -1) return [...oldData];

          const conversation: UserConversation = {
            ...oldData[index],
            lastMessage: {
              ...data,
              file: data.file ?? "",
              user,
              _count: {
                seenBy: 0,
              },
            },
          };

          const newData = [conversation];

          for (let i = 0; i < oldData.length; i++) {
            if (i !== index) {
              newData.push(oldData[i]);
            }
          }

          return newData;
        }
      );

      return { previousMessagesData, previousConversationsData };
    },
    onError: (_error, { conversationId }, context) => {
      queryClient.setQueryData(
        ["meesages", conversationId],
        context?.previousMessagesData
      );

      queryClient.setQueryData(
        ["conversations"],
        context?.previousConversationsData
      );

      toast({
        description: (
          <ToastMessage type="error" message="Error sending message" />
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
