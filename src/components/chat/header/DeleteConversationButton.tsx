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
import { deleteConversation } from "@/lib/actions/conversation/mutations";
import { useRouter } from "next/navigation";
import { FormMessage } from "@/components/common";
import { Loader2 } from "lucide-react";

type Props = {
  conversationId: string;
};

export default function DeleteConversationButton({ conversationId }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(async () => {
      const result = await deleteConversation(conversationId);

      if (result.success) {
        setIsOpen(false);

        toast({
          description: (
            <FormMessage
              type="success"
              message="Conversation deleted successfully"
            />
          ),
        });

        router.push("/conversations");
      }

      if (result.error) {
        toast({
          description: (
            <FormMessage type="error" message="Error  deleting conversation" />
          ),
        });
      }
    });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            conversation and remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleClick}
          >
            Delete
            {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
