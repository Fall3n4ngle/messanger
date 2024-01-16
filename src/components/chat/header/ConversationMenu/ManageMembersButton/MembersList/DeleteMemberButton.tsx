import { FormMessage } from "@/components/common";
import { Button } from "@/components/ui";
import { deleteMember } from "@/lib/actions/member/mutations";
import { useToast } from "@/lib/hooks";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";

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
        toast({
          description: (
            <FormMessage type="success" message="Deleted member successfully" />
          ),
        });

        onDialogClose();
        return;
      }

      toast({
        description: (
          <FormMessage type="error" message="Failed to delete member" />
        ),
      });
    });

  return (
    <Button onClick={handleClick} disabled={isPending} variant="destructive">
      Delete {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
    </Button>
  );
}
