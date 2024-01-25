import { editConversation } from "../actions/conversation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEditConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};
