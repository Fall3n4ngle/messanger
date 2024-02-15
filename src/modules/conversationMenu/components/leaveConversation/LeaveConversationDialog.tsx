import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  DropdownMenuItem,
} from "@/ui";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import LeaveConversationButton from "./LeaveConversationButton";
import { DeleteMemberFields } from "../../validations/member";

export default function LeaveConversationDialog({
  conversationId,
  memberId,
}: DeleteMemberFields) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
          <button className="flex items-center gap-3 px-2 py-1.5">
            <Trash2 className="h-4 w-4 text-destructive" />
            Leave
          </button>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are going to leave this conversation. You will loose access to
            it and all of your messages will be deleted
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LeaveConversationButton
            conversationId={conversationId}
            memberId={memberId}
            onDialogClose={handleDialogClose}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
