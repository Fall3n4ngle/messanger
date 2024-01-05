import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { SlidersHorizontal } from "lucide-react";
import { TMember } from "../lib/types";
import { MembersList } from "./MembersList";
import { AddMembersButton } from "./AddMembersButton";

type Props = {
  members: TMember[];
  conversationId: string;
};

export default function ManageMembersButton({
  conversationId,
  members,
}: Props) {
  const currentMembers = members.map((member) => member.user.id);

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-4 w-4" />
          Manage members
        </div>
      </DialogTrigger>
      <DialogContent className="min-h-[450px] flex flex-col gap-5">
        <DialogHeader>
          <DialogTitle>Manage members ({members.length - 1})</DialogTitle>
          <DialogDescription>
            Edit roles, add or delete members
          </DialogDescription>
        </DialogHeader>
        <div className="grow">
          <MembersList conversationId={conversationId} members={members} />
        </div>
        <div className="self-end">
          <AddMembersButton
            conversationId={conversationId}
            currentMembers={currentMembers}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
