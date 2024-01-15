import { sendMessage } from "@/lib/actions/messages/mutations";
import { useToast } from "@/lib/hooks";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Message } from "../../../lib/types";
import { FormMessage } from "@/components/common";
import { Conversation } from "@/components/conversations/lib/types";
import { flushSync } from "react-dom";

type Props = Pick<Message, "member">;

export const useSendMessage = ({ member }: Props) => {
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

      flushSync(() => {
        queryClient.setQueryData(
          ["messages", data.conversationId],
          ({ pages, pageParams }: InfiniteData<Message[], unknown>) => {
            const newMessage: Message = { ...data, seenBy: [], member };

            return {
              pages: pages.map((page, index) =>
                index === pages.length - 1 ? [...page, newMessage] : page
              ),
              pageParams,
            };
          }
        );
      });

      queryClient.setQueriesData(
        {
          queryKey: ["conversations"],
        },
        (oldData: Conversation[] | undefined) => {
          if (!oldData) return [];

          const index = oldData.findIndex((c) => c.id === data.conversationId);

          if (index === -1) return [...oldData];

          const conversation: Conversation = {
            ...oldData[index],
            lastMessage: {
              ...data,
              member,
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
          <FormMessage type="error" message="Error sending message" />
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
