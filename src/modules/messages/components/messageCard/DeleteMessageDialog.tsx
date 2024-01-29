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
} from "@/ui";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteMessage } from "../../hooks/useDeleteMessage";

type Props = {
  messageId: string;
  conversationId: string;
  previousMessageId: string | null;
};

export default function DeleteMessageButton({
  conversationId,
  messageId,
  previousMessageId,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = useDeleteMessage();

  const handleClick = () => {
    mutate({ conversationId, messageId, previousMessageId });
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button className="w-full flex items-end gap-3 p-2">
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