"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { MoreVertical } from "lucide-react";
import ConversationInfoButton from "./ConversationInfoButton";
import LeaveConversationButton from "./LeaveConversationButton";
import ManageMembersButton from "./ManageMembersButton";
import EditConversationButton from "./EditConversationButton";

export default function ConversationMenuButton() {
  return (
    <DropdownMenu>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Options</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent className="p-1.5 space-y-0.5">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <ConversationInfoButton />
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <EditConversationButton />
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <ManageMembersButton />
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <LeaveConversationButton conversationId="" userClerkId="" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
