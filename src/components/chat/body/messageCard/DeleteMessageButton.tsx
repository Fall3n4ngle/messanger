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
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteMessage } from "../lib/hooks/useDeleteMessage";

type Props = {
  messageId: string;
  conversationId: string;
};

export default function DeleteMessageButton({
  conversationId,
  messageId,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = useDeleteMessage();

  const handleClick = () => {
    mutate({ conversationId, messageId })
    setIsOpen(false);
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
