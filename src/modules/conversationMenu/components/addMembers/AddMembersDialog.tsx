import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui";
import AddMembersForm from "./AddMembersForm";
import { useState } from "react";

type Props = {
  conversationId: string;
  currentMembers: string[];
};

export default function AddMembersDialog({
  conversationId,
  currentMembers,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogTrigger asChild>
        <Button>Add members</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add members</DialogTitle>
        </DialogHeader>
        <AddMembersForm
          onDialogClose={handleDialogClose}
          conversationId={conversationId}
          currentMembers={currentMembers}
        />
      </DialogContent>
    </Dialog>
  );
}
