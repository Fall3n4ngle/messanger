import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConversation } from "../actions/conversation";

export const useNewConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};
