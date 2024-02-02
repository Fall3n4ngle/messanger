"use client";

import { Button } from "@/ui";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/common/hooks";
import { deleteMember } from "../../actions/member";
import { ToastMessage } from "@/components";
import { Loader2 } from "lucide-react";

type Props = {
  conversationId: string;
  memberId: string;
  onDialogClose: Function;
};

export default function LeaveConversationButton({
  conversationId,
  memberId,
  onDialogClose,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteMember,
    onError() {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to leave conversation" />
        ),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
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
      {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
    </Button>
  );
}
