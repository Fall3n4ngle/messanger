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
import DeleteMemberButton from "./DeleteMemberButton";
import { DeleteMemberFields } from "../../validations/member";

export default function DeleteMemberDialog(props: DeleteMemberFields) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are going to delete this member from the conversation. All of
            his messages will be deleted too
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <DeleteMemberButton {...props} onDialogClose={handleDialogClose} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
