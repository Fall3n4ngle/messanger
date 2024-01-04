import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from "@/components/ui";
import { SlidersHorizontal } from "lucide-react";
import { TMember } from "../lib/types";
import { useActiveUsers } from "@/store";
import DeleteMemberButton from "./DeleteMemberButton";
import MemberRoles from "./MemberRoles";
import { UserCard } from "@/components/common";

type Props = {
  members: TMember[];
  conversationId: string;
};

export default function ManageMembersButton({
  members,
  conversationId,
}: Props) {
  const { usersIds } = useActiveUsers();

  const membersWithoutAdmin = members.filter(
    (members) => members.role !== "ADMIN"
  );

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
          <DialogTitle>Manage members ({members.length})</DialogTitle>
          <DialogDescription>
            Edit roles, add or delete members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <ul className="flex flex-col gap-2">
            {membersWithoutAdmin.map(({ id, role, user }) => {
              const { clerkId, ...props } = user;
              const isActive = usersIds.includes(clerkId);

              const rightSide = (
                <div className="flex items-center gap-2">
                  <DeleteMemberButton />
                  <MemberRoles
                    id={id}
                    role={role}
                    conversationId={conversationId}
                  />
                </div>
              );

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
      </DialogContent>
    </Dialog>
  );
}
