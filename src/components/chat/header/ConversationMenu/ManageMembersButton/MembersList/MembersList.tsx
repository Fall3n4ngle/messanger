import { useActiveUsers } from "@/store";
import { TMember } from "../../lib/types";
import { ScrollArea } from "@/components/ui";
import DeleteMemberButton from "./DeleteMemberButton";
import MemberRoles from "./MemberRoles";
import { UserCard } from "@/components/common";

type Props = {
  members: TMember[];
  conversationId: string;
};

export default function MembersList({ conversationId, members }: Props) {
  const { usersIds } = useActiveUsers();

  const membersWithoutAdmin = members.filter(
    (members) => members.role !== "ADMIN"
  );

  return (
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
              <UserCard isActive={isActive} {...props} rightSide={rightSide} />
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
