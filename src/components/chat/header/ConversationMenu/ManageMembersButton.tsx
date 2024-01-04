import { Dialog, DialogContent, DialogTrigger } from "@/components/ui";
import { SlidersHorizontal } from "lucide-react";

export default function ManageMembersButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-4 w-4" />
          Manage members
        </div>
      </DialogTrigger>
      <DialogContent>Manage members</DialogContent>
    </Dialog>
  );
}
