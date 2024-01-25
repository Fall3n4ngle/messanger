import { ToastMessage } from "@/components";
import { Button } from "@/ui";
import { deleteMember } from "../../actions/member";
import { useToast } from "@/common/hooks";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { revalidatePathFromClient } from "@/common/actions/revalidatePath";

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
  const [isPending, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(async () => {
      const result = await deleteMember({
        conversationId,
        memberId,
      });

      if (result?.success) {
        await revalidatePathFromClient(`/conversations/${conversationId}`);

        toast({
          description: (
            <ToastMessage
              type="success"
              message="Deleted member successfully"
            />
          ),
        });

        onDialogClose();
        return;
      }

      toast({
        description: (
          <ToastMessage type="error" message="Failed to delete member" />
        ),
      });
    });

  return (
    <Button onClick={handleClick} disabled={isPending} variant="destructive">
      Delete {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
    </Button>
  );
}
