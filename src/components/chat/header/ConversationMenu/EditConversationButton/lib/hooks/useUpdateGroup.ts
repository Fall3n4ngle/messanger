import { updateGroup } from "@/lib/actions/conversation/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};
