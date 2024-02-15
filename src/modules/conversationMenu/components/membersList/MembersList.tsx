import { useActiveUsers } from "@/common/store";
import { ScrollArea } from "@/ui";
import DeleteMemberDialog from "./DeleteMemberDialog";
import RolesPopover from "./RolesPopover";
import { UserCard } from "@/components";
import { UserMember } from "@/common/actions/member/queries";
import { AvailableRoles } from "@/common/const";

type Props = {
  members: UserMember[];
  conversationId: string;
};

export default function MembersList({ conversationId, members }: Props) {
  const { usersIds } = useActiveUsers();

  return (
    <ScrollArea>
      <ul className="flex flex-col gap-2">
        {members
          .filter((members) => members.role !== "ADMIN")
          .map(({ id, role, user }) => {
            const { clerkId, ...props } = user;
            const isActive = usersIds.includes(clerkId);

            const rightSide = (
              <div className="flex items-center gap-2">
                <DeleteMemberDialog
                  conversationId={conversationId}
                  memberId={id}
                />
                <RolesPopover
                  memberId={id}
                  role={role as AvailableRoles}
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
  );
}
