import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteMessageFields } from "@/modules/messages/validations/message";
import DeleteMessageButton from "./DeleteMessageButton";

export default function DeleteMessageDialog(props: DeleteMessageFields) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button className="flex w-full items-end gap-3 p-2">
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
          <DeleteMessageButton onDialogClose={handleDialogClose} {...props} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
