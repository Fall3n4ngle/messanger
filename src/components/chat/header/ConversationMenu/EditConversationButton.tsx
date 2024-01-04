import { Dialog, DialogContent, DialogTrigger } from "@/components/ui";
import { Settings } from "lucide-react";

export default function EditConversationButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-3">
          <Settings className="h-4 w-4" />
          Edit group
        </div>
      </DialogTrigger>
      <DialogContent>dwqdwq</DialogContent>
    </Dialog>
  );
}
