import { editConversation } from "../actions/conversation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revalidatePathFromClient } from "@/common/actions/revalidatePath";
import { useToast } from "@/common/hooks";
import { ToastMessage } from "@/components";

export const useEditConversation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: editConversation,
    onSuccess: async (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      await revalidatePathFromClient(`/conversations/${id}`);

      toast({
        description: (
          <ToastMessage
            type="success"
            message="Conversation updated successfully"
          />
        ),
      });
    },
    onError: () => {
      toast({
        description: (
          <ToastMessage type="error" message="Error updating conversation" />
        ),
      });
    },
  });
};
