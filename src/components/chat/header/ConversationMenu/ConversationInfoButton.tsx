"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { Info } from "lucide-react";

export default function ConversationInfoButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-3">
          <Info className="h-4 w-4" />
          View group info
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Group info</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
