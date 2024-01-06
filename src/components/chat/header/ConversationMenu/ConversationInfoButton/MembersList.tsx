import {
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { TMember } from "../lib/types";
import { UserCard } from "@/components/common";
import { useActiveUsers } from "@/store";
import { MemberRole } from "@prisma/client";
import { allMemberRoles } from "@/lib/const/memberRoles";

type Props = {
  members: TMember[];
};

export default function MembersList({ members }: Props) {
  const { usersIds } = useActiveUsers();

  const getRightSide = (role: MemberRole) => {
    const value = allMemberRoles.find((r) => r.value === role);
    if (!value) return null;
    const { label, description } = value;

    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger>{label}</TooltipTrigger>
          <TooltipContent side="bottom">{description}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <ScrollArea>
      <ul>
        {members.map(({ id, role, user }) => {
          const { clerkId, ...props } = user;
          const isActive = usersIds.includes(clerkId);
          const rightSide = getRightSide(role);

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