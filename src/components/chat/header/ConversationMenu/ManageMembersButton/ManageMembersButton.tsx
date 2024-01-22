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
        <button className="flex items-center gap-3 px-2 py-1.5">
          <SlidersHorizontal className="h-4 w-4" />
          Manage members
        </button>
      </DialogTrigger>
      <DialogContent className="h-[500px] max-w-[600px] flex flex-col gap-5">
        <DialogHeader>
          <DialogTitle>Manage members ({members.length - 1})</DialogTitle>
          <DialogDescription>
            Edit roles, add or delete members
          </DialogDescription>
        </DialogHeader>
        <MembersList conversationId={conversationId} members={members} />
        <div className="self-end mt-auto">
          <AddMembersButton
            conversationId={conversationId}
            currentMembers={currentMembers}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
