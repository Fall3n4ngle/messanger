import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "@/lib/actions/conversation/mutations";

export const useNewConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};
