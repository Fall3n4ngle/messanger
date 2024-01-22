import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { Settings } from "lucide-react";
import { Conversation } from "./lib/types";
import { useState } from "react";
import EditConversationForm from "./EditConversationForm";

export default function EditConversationButton(props: Conversation) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-3 px-2 py-1.5">
          <Settings className="h-4 w-4" />
          Edit group
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit conversation</DialogTitle>
          <DialogDescription>
            Edit conversation name and image
          </DialogDescription>
        </DialogHeader>
        <EditConversationForm onDialogClose={handleDialogClose} {...props} />
      </DialogContent>
    </Dialog>
  );
}
