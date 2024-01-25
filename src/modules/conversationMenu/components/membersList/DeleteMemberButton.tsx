import { Button } from "@/ui";
import { Loader2 } from "lucide-react";
import { useDeleteMember } from "../../hooks/useDeleteMember";

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
  const { mutateAsync, isPending } = useDeleteMember();

  const handleClick = async () => {
    await mutateAsync({ conversationId, memberId });
    onDialogClose();
  };

  return (
    <Button onClick={handleClick} disabled={isPending} variant="destructive">
      Delete {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
    </Button>
  );
}
