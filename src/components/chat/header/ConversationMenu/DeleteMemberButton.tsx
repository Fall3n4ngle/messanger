"use client";

import { useToast } from "@/lib/hooks";
import { Button } from "@/components/ui";
import { ReactNode, useTransition } from "react";
import { FormMessage } from "@/components/common";
import { Loader2 } from "lucide-react";
import { deleteMember } from "@/lib/actions/member/mutations";

type Props = {
  conversationId: string;
  memberId: string;
  onDialogClose?: Function;
  successMessage: string;
  errorMessage: string;
  children: ReactNode;
};

export default function DeleteMemberButton({
  conversationId,
  memberId,
  onDialogClose,
  errorMessage,
  successMessage,
  children,
}: Props) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(async () => {
      const result = await deleteMember({
        conversationId,
        memberId,
      });

      if (result.success) {
        if (onDialogClose) onDialogClose();

        toast({
          description: <FormMessage type="success" message={successMessage} />,
        });
      }

      if (result.error) {
        toast({
          description: <FormMessage type="error" message={errorMessage} />,
        });
      }
    });

  return (
    <Button variant="destructive" disabled={isPending} onClick={handleClick}>
      {children}
      {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
    </Button>
  );
}
