"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui";
import { UserPlus } from "lucide-react";
import CreateGroupForm from "./CreateGroupForm";

export default function CreateGroupButton() {
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
                <UserPlus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Create group</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="min-h-[400px] flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>Create group</DialogTitle>
          <DialogDescription>
            Choose group name, image and add other users
          </DialogDescription>
        </DialogHeader>
        <CreateGroupForm onDialogClose={handleDialogClose} />
      </DialogContent>
    </Dialog>
  );
}
