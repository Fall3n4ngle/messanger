import { UserConversation } from "@/common/actions/conversation/queries";
import { deleteMember } from "../actions/member";
import { useToast } from "@/common/hooks";
import { ToastMessage } from "@/components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Props = {
  onDialogClose: Function | undefined;
};

export const useLeaveConversation = ({ onDialogClose }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteMember,
    onMutate: ({ conversationId }) => {
      queryClient.cancelQueries({
        queryKey: ["conversations"],
      });

      const previousData = queryClient.getQueriesData({
        queryKey: ["conversations"],
      });

      queryClient.setQueriesData(
        {
          queryKey: ["conversations"],
        },
        (oldData: UserConversation[] | undefined) => {
          if (!oldData) return [];

          return oldData.filter(
            (conversation) => conversation.id !== conversationId
          );
        }
      );

      toast({
        description: (
          <ToastMessage type="success" message="You left successfully" />
        ),
      });

      onDialogClose && onDialogClose();
      router.push("/conversations");

      return { previousData };
    },
    onError(_error, _variables, context) {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to leave conversation" />
        ),
      });

      queryClient.setQueriesData(
        {
          queryKey: ["conversations"],
        },
        context?.previousData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};
