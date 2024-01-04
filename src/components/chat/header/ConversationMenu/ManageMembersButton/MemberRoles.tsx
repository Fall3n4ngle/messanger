"use client";

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { ChevronsUpDown } from "lucide-react";
import { MemberRole } from "@prisma/client";
import { useState } from "react";
import { memberRoles } from "@/lib/const/memberRoles";
import { changeMemberRole } from "@/lib/actions/member/mutations";
import { useToast } from "@/lib/hooks";
import { FormMessage } from "@/components/common";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  role: MemberRole;
  conversationId: string;
};

export default function MemberRoles({ id, role, conversationId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [optimisticRole, setOptimisticRole] = useState(role);
  const { toast } = useToast();

  const handleSelect = async (newRole: MemberRole) => {
    setOptimisticRole(newRole);

    const result = await changeMemberRole({
      id,
      role: newRole,
      conversationId,
    });

    if (result.success) {
      toast({
        description: (
          <FormMessage type="success" message="Role updated successfully" />
        ),
      });
    }

    if (result.error) {
      setOptimisticRole(role);

      toast({
        description: <FormMessage type="error" message="Error updating role" />,
      });
    }
  };

  const currentRoleLabel = memberRoles.find(
    (r) => r.value === optimisticRole
  )?.label;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[100px] justify-between"
          aria-expanded={isOpen}
        >
          {currentRoleLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end">
        <Command>
          <CommandInput placeholder="Select a role..." />
          <CommandEmpty>No roles found.</CommandEmpty>
          <CommandGroup>
            {memberRoles.map((r) => (
              <CommandItem
                key={r.value}
                className={cn(
                  "teamaspace-y-1 flex flex-col mb-1 items-start px-4 py-2",
                  r.value === optimisticRole &&
                    "bg-secondary hover:bg-secondary cursor-default"
                )}
                value={r.value}
                disabled={r.value === optimisticRole}
                onSelect={() => handleSelect(r.value)}
              >
                <p>{r.label}</p>
                <p className="text-sm text-muted-foreground">{r.description}</p>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
