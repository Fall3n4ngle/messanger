"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { Info } from "lucide-react";
import ConversationDescription from "./ConversationDescription";
import { TMember } from "../lib/types";
import MembersList from "./MembersList";

type Props = {
  name: string;
  image: string | null;
  members: TMember[];
};

export default function ConversationInfoButton({ members, ...props }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-3">
          <Info className="h-4 w-4" />
          View group info
        </div>
      </DialogTrigger>
      <DialogContent className="h-[500px] space-y-1">
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
