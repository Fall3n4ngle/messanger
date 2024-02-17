import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
} from "@/ui";
import { Info } from "lucide-react";
import ConversationDescription from "./ConversationDescription";
import MembersList from "./MembersList";
import { Conversation } from "@/common/actions/conversation/queries";

type Props = Pick<Conversation, "name" | "image" | "members">;

export default function ConversationInfoDialog({ members, ...props }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
          <button className="flex items-center gap-3 px-2 py-1.5">
            <Info className="h-4 w-4" />
            View group info
          </button>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent
        className="flex h-[500px] flex-col space-y-4"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Group info</DialogTitle>
        </DialogHeader>
        <ConversationDescription membersCount={members.length} {...props} />
        <h4 className="scroll-m-20 font-semibold tracking-tight">Members</h4>
        <MembersList members={members} />
      </DialogContent>
    </Dialog>
  );
}
