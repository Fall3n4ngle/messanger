import { sendMessage } from "../actions/message";
import { useToast } from "@/common/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastMessage } from "@/components";

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: sendMessage,
    onError: () => {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to send message" />
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
