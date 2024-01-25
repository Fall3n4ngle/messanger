"use client";

import { Button } from "@/ui";
import { useLeaveConversation } from "../../hooks/useLeaveConversation";

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
  const { mutate } = useLeaveConversation({ onDialogClose });

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
