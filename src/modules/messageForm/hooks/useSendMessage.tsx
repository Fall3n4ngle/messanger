import { sendMessage } from "../actions/message";
import { useToast } from "@/common/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastMessage } from "@/components";
import { conversationKeys, messageKeys } from "@/common/const";

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(conversationId),
        stale: true,
      });

      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
    },
    onError: () => {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to send message" />
        ),
      });
    },
  });
};
