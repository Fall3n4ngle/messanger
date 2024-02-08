import { Button } from "@/ui";
import { useToast } from "@/common/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMember } from "../../actions/member";
import { ToastMessage } from "@/components";
import { Loader2 } from "lucide-react";

type Props = {
  conversationId: string;
  memberId: string;
  onDialogClose: Function;
};

export default function DeleteMemberButton({
  conversationId,
  memberId,
  onDialogClose,
}: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteMember,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", conversationId],
      });

      toast({
        description: (
          <ToastMessage type="success" message="Deleted member successfully" />
        ),
      });

      onDialogClose();
    },
    onError: () => {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to delete member" />
        ),
      });
    },
  });

  const handleClick = () => {
    mutate({ conversationId, memberId });
  };

  return (
    <Button onClick={handleClick} disabled={isPending} variant="destructive">
      Delete
      {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
    </Button>
  );
}
