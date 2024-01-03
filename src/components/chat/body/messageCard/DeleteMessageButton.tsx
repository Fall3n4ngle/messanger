import { FormMessage } from "@/components/common";
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
import { deleteMessage } from "@/lib/actions/messages/mutations";
import { useToast } from "@/lib/hooks";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteMessage } from "../lib/hooks/useDeleteMessage";
import { useAuth } from "@clerk/nextjs";

type Props = {
  messageId: string;
  conversationId: string;
};

export default function DeleteMessageButton({
  conversationId,
  messageId,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { revertCache, updateCache } = useDeleteMessage();
  const { userId } = useAuth();

  const handleClick = async () => {
    if (!userId) {
      toast({
        description: <FormMessage type="error" message="Missing userId" />,
      });

      return;
    }

    updateCache({
      conversationId,
      messageId,
    });

    setIsOpen(false);

    toast({
      description: <FormMessage type="success" message="Message was deleted" />,
    });

    const result = await deleteMessage({
      conversationId,
      messageId,
    });

    if (result.error) {
      revertCache({ conversationId });

      toast({
        description: (
          <FormMessage type="error" message="Error deleting message" />
        ),
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button className="w-full flex items-end gap-3">
          <Trash2 className="text-destructive" /> <span>Delete</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are going to delete this message. You will not be able to see it
            again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleClick}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
