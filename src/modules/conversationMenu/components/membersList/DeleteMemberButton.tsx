import { Button } from "@/ui";
import { useToast } from "@/common/hooks";
import { useMutation } from "@tanstack/react-query";
import { deleteMember } from "../../actions/member";
import { ToastMessage } from "@/components";

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

  const { mutate, isPending } = useMutation({
    mutationFn: deleteMember,
    onSuccess: async () => {
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
    <Button onClick={handleClick} isLoading={isPending} variant="destructive">
      Delete
    </Button>
  );
}
