import { availableMemberRoles } from "@/common/const";
import { cn } from "@/common/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/ui";
import { useChangeRole } from "../../hooks/useChangeRole";
import { ChangeRoleFields } from "../../validations/member";

export default function RolesCommand({
  memberId,
  role,
  conversationId,
}: ChangeRoleFields) {
  const { mutate: changeRole } = useChangeRole();

  const handleSelect = async (newRole: ChangeRoleFields["role"]) => {
    changeRole({ memberId, role: newRole, conversationId });
  };

  return (
    <Command>
      <CommandInput placeholder="Select a role..." />
      <CommandEmpty>No roles found.</CommandEmpty>
      <CommandGroup>
        {availableMemberRoles.map((r) => (
          <CommandItem
            key={r.value}
            className={cn(
              "teamaspace-y-1 mb-1 flex flex-col items-start px-4 py-2",
              r.value === role &&
                "cursor-default bg-secondary hover:bg-secondary",
            )}
            value={r.value}
            disabled={r.value === role}
            onSelect={() => handleSelect(r.value)}
          >
            <p>{r.label}</p>
            <p className="text-sm text-muted-foreground">{r.description}</p>
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}
