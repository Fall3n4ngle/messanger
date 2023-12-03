"use client";

import { useState } from "react";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui";
import { UserPlus } from "lucide-react";
import ConversationDialog from "./GroupDialog";
import { CreateGroupForm } from "../common";

export default function GroupButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Create group conversation"
              className="rounded-full"
              onClick={() => setOpen(true)}
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Create group</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <ConversationDialog open={open} setOpen={setOpen}>
        <CreateGroupForm
          successMessage="Conversation created successfully"
          errorMessage="Failed to create conversation"
        />
      </ConversationDialog>
    </>
  );
}
