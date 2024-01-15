"use client";

import { useToast } from "@/lib/hooks";
import { Button } from "@/components/ui";
import { FormMessage } from "@/components/common";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMember } from "@/lib/actions/member/mutations";
import { Conversation } from "@/components/conversations/lib/types";

type Props = {
  conversationId: string;
  memberId: string;
  onDialogClose?: Function;
};

export default function LeaveConversationButton({
  conversationId,
  memberId,
  onDialogClose,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteMember,
    onMutate: ({ conversationId }) => {
      const previousData = queryClient.getQueriesData({
        queryKey: ["conversations"],
      });

      queryClient.setQueriesData(
        {
          queryKey: ["conversations"],
        },
        (oldData: Conversation[] | undefined) => {
          if (!oldData) return [];

          return oldData.filter(
            (conversation) => conversation.id !== conversationId
          );
        }
      );

      toast({
        description: (
          <FormMessage type="success" message="You left successfully" />
        ),
      });

      onDialogClose && onDialogClose();
      router.push("/conversations");

      return { previousData };
    },
    onError: (_error, _vars, context) => {
      toast({
        description: (
          <FormMessage type="error" message="Failed to leave conversation" />
        ),
      });

      queryClient.setQueriesData(
        {
          queryKey: ["conversations"],
        },
        context?.previousData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });

  const handleClick = async () => {
    mutate({
      conversationId,
      memberId,
    });
  };

  return (
    <Button variant="destructive" onClick={handleClick}>
      Leave
    </Button>
  );
}
