"use client";

import {
  Button,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui";
import { MoreVertical } from "lucide-react";
import { UserCard } from "../../common";
import LeaveConversationButton from "./LeaveConversationButton";
import { useAuth } from "@clerk/nextjs";
import { useActiveUsers } from "@/store";
import MemberRoles from "./MemberRoles";
import { Member, MemberRole } from "@prisma/client";
import { memberRoles } from "@/lib/const/memberRoles";
import EditGroupButton from "./EditGroupButton";

type TMember = Member & {
  user: {
    id: string;
    name: string;
    image: string | null;
    clerkId: string;
  };
};

export type ChatSheetProps = {
  conversationId: string;
  name: string;
  members: TMember[];
  isGroup: boolean;
  memberRole: MemberRole;
  image: string | null;
};

export default function ChatSheetButton({
  members,
  name,
  conversationId,
  isGroup,
  memberRole,
  image,
}: ChatSheetProps) {
  const { userId } = useAuth();
  const { usersIds } = useActiveUsers();

  if (!userId) return null;

  const getRigthSide = (role: MemberRole, id: string) => {
    let rightSide;

    if (role === "ADMIN") {
      rightSide = <div className="w-[100px] text-center">Admin</div>;
    } else if (memberRole === "ADMIN") {
      rightSide = (
        <MemberRoles id={id} role={role} conversationId={conversationId} />
      );
    } else {
      const roleLabel = memberRoles.find((r) => r.value === role)?.label;
      rightSide = <div className="w-[100px] text-center">{roleLabel}</div>;
    }

    return rightSide;
  };

  const defaultMembers = members
    .filter((member) => member.role !== "ADMIN")
    .map((member) => ({
      value: member.user.id,
      label: member.user.name,
      image: member.user.image ?? "",
    }));

  const canEdit = isGroup && memberRole === "ADMIN";

  return (
    <Sheet>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <MoreVertical />
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>View more</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SheetContent>
        <SheetHeader className="text-left">
          <SheetTitle className="text-2xl">{name}</SheetTitle>
          <SheetDescription>{`${members.length} members`}</SheetDescription>
        </SheetHeader>
        <div className="pt-6 flex flex-col justify-between h-[90%]">
          <ScrollArea>
            <ul className="flex flex-col gap-2 mb-6">
              {members.map(({ id, role, user }) => {
                const { clerkId, ...props } = user;
                const isActive = usersIds.includes(clerkId);

                const rightSide = getRigthSide(role, id);

                return (
                  <li key={id}>
                    <UserCard
                      isActive={isActive}
                      {...props}
                      rightSide={rightSide}
                    />
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
          <div className="flex items-center gap-3">
            <LeaveConversationButton
              conversationId={conversationId}
              userClerkId={userId}
            />
            {canEdit && (
              <EditGroupButton
                name={name}
                image={image}
                members={defaultMembers}
                conversationId={conversationId}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
