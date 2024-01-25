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
import { MemberRole } from "@prisma/client";
import { UserMember } from "@/common/actions/member/queries";
import ConversationInfoButton from "./conversationInfo/ConversationInfoButton";
import ManageMembersButton from "./ManageMembersButton";
import EditConversationButton from "./editConversation/EditConversationButton";
import LeaveConversationButton from "./leaveConversation/LeaveConversationDialog";

type Props = {
  memberRole: MemberRole;
  isGroup: boolean;
  members: UserMember[];
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
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
          <ConversationInfoButton name={name} image={image} members={members} />
        </DropdownMenuItem>
        {canEdit && (
          <>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="p-0"
            >
              <EditConversationButton
                id={conversationId}
                name={name}
                image={image}
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="p-0"
            >
              <ManageMembersButton
                members={members}
                conversationId={conversationId}
              />
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
          <LeaveConversationButton
            conversationId={conversationId}
            memberId={userMemberId}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
