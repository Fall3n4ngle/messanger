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
import { getUserAuth } from "@/lib/utils";
import { redirect } from "next/navigation";
import LeaveConversationButton from "./LeaveConversationButton";

type Member = {
  id: string;
  name: string;
  image: string | null;
};

export type ChatSheetProps = {
  conversationId: string;
  name: string;
  members: Member[];
};

export default async function ChatSheetButton({
  members,
  name,
  conversationId,
}: ChatSheetProps) {
  const { session } = await getUserAuth();
  if (!session) redirect("/sign-in");

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
            {members.map(({ id, ...props }) => (
              <li key={id}>
                <UserCard {...props} />
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <LeaveConversationButton
              conversationId={conversationId}
              userClerkId={session.user.id}
            />
            <DeleteConversationButton conversationId={conversationId} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
