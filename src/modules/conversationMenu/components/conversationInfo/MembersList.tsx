import { Conversation } from "@/common/actions/conversation/queries";
import { allMemberRoles } from "@/common/const";
import { useActiveUsers } from "@/common/store";
import { UserCard } from "@/components";
import {
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui";
import { MemberRole } from "@prisma/client";

type Props = Pick<Conversation, "members">;

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
      <ul className="flex flex-col gap-1.5">
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
