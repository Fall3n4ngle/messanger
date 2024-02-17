import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
} from "@/ui";
import { SlidersHorizontal } from "lucide-react";
import { UserMember } from "@/common/actions/member/queries";
import MembersList from "./membersList/MembersList";
import AddMembersDialog from "./addMembers/AddMembersDialog";

type Props = {
  members: UserMember[];
  conversationId: string;
};

export default function ManageMembersButton({
  conversationId,
  members,
}: Props) {
  const currentMembers = members.map((member) => member.user.id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
          <button className="flex items-center gap-3 px-2 py-1.5">
            <SlidersHorizontal className="h-4 w-4" />
            Manage members
          </button>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="flex h-[500px] max-w-[600px] flex-col gap-5">
        <DialogHeader>
          <DialogTitle>Manage members ({members.length - 1})</DialogTitle>
          <DialogDescription>
            Edit roles, add or delete members
          </DialogDescription>
        </DialogHeader>
        <MembersList conversationId={conversationId} members={members} />
        <div className="mt-auto self-end">
          <AddMembersDialog
            conversationId={conversationId}
            currentMembers={currentMembers}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
