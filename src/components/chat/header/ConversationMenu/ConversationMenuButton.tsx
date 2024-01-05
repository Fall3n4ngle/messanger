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
import { ManageMembersButton } from "./ManageMembersButton";
import { EditConversationButton } from "./EditConversationButton";
import { MemberRole } from "@prisma/client";
import { TMember } from "./lib/types";

type Props = {
  memberRole: MemberRole;
  isGroup: boolean;
  members: TMember[];
  conversationId: string;
  name: string;
  image: string | null;
  userMemberId: string;
};

export default function ConversationMenuButton({
  isGroup,
  memberRole,
  members,
  conversationId,
  userMemberId,
  image,
  name,
}: Props) {
  const canEdit = isGroup && memberRole === "ADMIN";

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
        {canEdit && (
          <>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <EditConversationButton
                id={conversationId}
                name={name}
                image={image}
              />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <ManageMembersButton
                members={members}
                conversationId={conversationId}
              />
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <LeaveConversationButton
            conversationId={conversationId}
            memberId={userMemberId}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
