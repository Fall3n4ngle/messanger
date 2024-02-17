"use client";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/ui";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import CreateConversationForm from "./CreateConversationForm";

export default function CreateConversationButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                aria-label="Create group conversation"
                className="rounded-full"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Create group</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="flex min-h-[300px] flex-col">
        <DialogHeader>
          <DialogTitle>Create group</DialogTitle>
          <DialogDescription>
            Choose group name, image and add other users
          </DialogDescription>
        </DialogHeader>
        <CreateConversationForm onDialogClose={handleDialogClose} />
      </DialogContent>
    </Dialog>
  );
}
