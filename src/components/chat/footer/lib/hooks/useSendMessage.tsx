import { sendMessage } from "@/lib/actions/messages/mutations";
import { useToast } from "@/lib/hooks";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Message } from "../../../lib/types";
import { FormMessage } from "@/components/common";

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

      const previousMessagesData = queryClient.getQueryData([
        "messages",
        data.conversationId,
      ]);

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

      return { previousMessagesData };
    },
    onError: (_error, { conversationId }, context) => {
      queryClient.setQueryData(
        ["meesages", conversationId],
        context?.previousMessagesData
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
