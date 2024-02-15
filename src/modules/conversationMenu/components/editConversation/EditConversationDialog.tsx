import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
} from "@/ui";
import { Settings } from "lucide-react";
import { useState } from "react";
import EditConversationForm from "./EditConversationForm";
import { EditConversationFields } from "../../validations/conversation";

export default function EditConversationDialog(props: EditConversationFields) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
          <button className="flex items-center gap-3 px-2 py-1.5">
            <Settings className="h-4 w-4" />
            Edit group
          </button>
        </DropdownMenuItem>
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
