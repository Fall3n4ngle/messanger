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
} from "@/ui";
import { MoreVertical } from "lucide-react";
import ConversationInfoDialog from "./conversationInfo/ConversationInfoDialog";
import ManageMembersDialog from "./ManageMembersDialog";
import EditConversationDialog from "./editConversation/EditConversationDialog";
import LeaveConversationDialog from "./leaveConversation/LeaveConversationDialog";
import { useParams } from "next/navigation";
import { useConversation, useMember } from "@/common/hooks";

export default function ConversationMenuButton() {
  const conversationId = useParams().conversationId as string;

  const { data: conversation } = useConversation({ conversationId });
  const { data: member } = useMember({
    conversationId,
  });

  if (!member || !conversation) return null;

  const { name, image, members } = conversation;
  const { id: memberId, role } = member;

  const canMutate = role === "ADMIN";

  return (
    <DropdownMenu>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full"
                aria-label="Options"
              >
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Options</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent className="p-1.5 space-y-0.5">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
          <ConversationInfoDialog name={name} image={image} members={members} />
        </DropdownMenuItem>
        {canMutate && (
          <>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="p-0"
            >
              <EditConversationDialog
                id={conversationId}
                name={name}
                image={image}
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="p-0"
            >
              <ManageMembersDialog
                members={members}
                conversationId={conversationId}
              />
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
          <LeaveConversationDialog
            conversationId={conversationId}
            memberId={memberId}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
