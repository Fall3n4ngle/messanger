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
import DeleteMemberButton from "../../LeaveConversationButton";

type Props = {
  conversationId: string;
  memberId: string;
};

export default function DeleteMemberDialog({
  conversationId,
  memberId,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <Button variant="destructive" size="icon">
          <Trash2 className="w-5 h-5" />
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
          <DeleteMemberButton
            conversationId={conversationId}
            memberId={memberId}
            onDialogClose={handleDialogClose}
            errorMessage="Failed to delete member"
            successMessage="Member was deleted successfully"
          >
            Leave
          </DeleteMemberButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
