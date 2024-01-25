import { useMutation } from "@tanstack/react-query";
import { deleteMember } from "../actions/member";
import { useToast } from "@/common/hooks";
import { revalidatePathFromClient } from "@/common/actions/revalidatePath";
import { ToastMessage } from "@/components";

export const useDeleteMember = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteMember,
    onSuccess: async (_, { conversationId }) => {
      await revalidatePathFromClient(`/conversations/${conversationId}`);

      toast({
        description: (
          <ToastMessage type="success" message="Deleted member successfully" />
        ),
      });
    },
    onError: () => {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to delete member" />
        ),
      });
    },
  });
};
