"use client";

import {
  Button,
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
import DeleteConversationButton from "./DeleteConversationButton";
import LeaveConversationButton from "./LeaveConversationButton";
import { useAuth } from "@clerk/nextjs";
import { useActiveUsers } from "@/store/useActiveUsers";
import { Member } from ".";

export type ChatSheetProps = {
  conversationId: string;
  name: string;
  members: Member[];
};

export default function ChatSheetButton({
  members,
  name,
  conversationId,
}: ChatSheetProps) {
  const { userId } = useAuth();
  const { usersIds } = useActiveUsers();

  if (!userId) return null;

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
        <div className="pt-6">
          <ul className="flex flex-col gap-2 mb-6">
            {members.map(({ id, clerkId, ...props }) => {
              const isActive = usersIds.includes(clerkId);

              return (
                <li key={id}>
                  <UserCard isActive={isActive} {...props} />
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-3">
            <LeaveConversationButton
              conversationId={conversationId}
              userClerkId={userId}
            />
            <DeleteConversationButton conversationId={conversationId} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
