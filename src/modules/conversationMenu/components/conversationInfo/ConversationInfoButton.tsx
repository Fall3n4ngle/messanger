"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui";
import { Info } from "lucide-react";
import ConversationDescription from "./ConversationDescription";
import MembersList from "./MembersList";
import { UserMember } from "@/common/actions/member/queries";

type Props = {
  name: string;
  image: string | null;
  members: UserMember[];
};

export default function ConversationInfoButton({ members, ...props }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-3 px-2 py-1.5">
          <Info className="h-4 w-4" />
          View group info
        </button>
      </DialogTrigger>
      <DialogContent
        className="h-[500px] space-y-1.5 flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Group info</DialogTitle>
        </DialogHeader>
        <div>
          <ConversationDescription membersCount={members.length} {...props} />
        </div>
        <h4 className="scroll-m-20 font-semibold tracking-tight">Members</h4>
        <MembersList members={members} />
      </DialogContent>
    </Dialog>
  );
}
