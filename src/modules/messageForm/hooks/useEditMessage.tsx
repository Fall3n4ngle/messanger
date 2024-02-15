import { ToastMessage } from "@/components";
import { editMessage } from "../actions/message";
import { useToast } from "@/common/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { conversationKeys, messageKeys } from "@/common/const";

export const useEditMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: editMessage,
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(conversationId),
        stale: true,
      });

      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });

      toast({
        description: (
          <ToastMessage type="success" message="Edited message successfully" />
        ),
      });
    },
    onError: () => {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to update message" />
        ),
      });
    },
  });
};
