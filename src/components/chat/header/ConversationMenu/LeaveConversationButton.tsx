"use client";

import { useToast } from "@/lib/hooks";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/components/ui";
import { useTransition, useState } from "react";
import { leaveConversation } from "@/lib/actions/conversation/mutations";
import { useRouter } from "next/navigation";
import { FormMessage } from "@/components/common";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
  conversationId: string;
  userClerkId: string;
};

export default function LeaveConversationButton({
  conversationId,
  userClerkId,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(async () => {
      const result = await leaveConversation({
        conversationId,
        userClerkId,
      });

      if (result.success) {
        setIsOpen(false);

        toast({
          description: (
            <FormMessage
              type="success"
              message="You left conversation successfully"
            />
          ),
        });

        router.push("/conversations");
      }

      if (result.error) {
        toast({
          description: (
            <FormMessage type="error" message="Error leaving conversation" />
          ),
        });
      }
    });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <div className="flex items-center gap-3">
          <Trash2 className="h-4 w-4 text-destructive" />
          Leave
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are going to leave this conversation. You will loose all the
            data. Members of this conversation wil see your messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleClick}
          >
            Leave
            {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
