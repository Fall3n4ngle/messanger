import { useToast } from "@/common/hooks";
import { ToastMessage } from "@/components";
import { Button } from "@/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { leaveConversation } from "../../actions/member";
import { conversationKeys } from "@/common/const";
import { DeleteMemberFields } from "../../validations/member";

type Props = {
  onDialogClose: Function;
} & DeleteMemberFields;

export default function LeaveConversationButton({
  conversationId,
  memberId,
  onDialogClose,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: leaveConversation,
    onError() {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to leave conversation" />
        ),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });

      onDialogClose();
      router.push("/conversations");
    },
  });

  const handleClick = async () => {
    mutate({
      conversationId,
      memberId,
    });
  };

  return (
    <Button variant="destructive" disabled={isPending} onClick={handleClick}>
      Leave
      {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
    </Button>
  );
}
