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
} from "@/ui";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/common/utils";
import { AvailableRoles, availableMemberRoles } from "../../const";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/common/hooks";
import { changeMemberRole } from "../../actions/member";
import { ToastMessage } from "@/components";

type Props = {
  id: string;
  role: AvailableRoles;
  conversationId: string;
};

export default function MemberRoles({ id, role, conversationId }: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [optimisticRole, setOptimisticRole] = useState(role);

  const { mutate: changeRole } = useMutation({
    mutationFn: changeMemberRole,
    onMutate: ({ role: newRole }) => {
      setOptimisticRole(newRole);

      toast({
        description: (
          <ToastMessage type="success" message="Role changed successfully" />
        ),
      });
    },
    onError: () => {
      setOptimisticRole(role);

      toast({
        description: (
          <ToastMessage type="error" message="Failed to change role" />
        ),
      });
    },
  });

  const handleSelect = async (newRole: AvailableRoles) => {
    changeRole({ memberId: id, role: newRole, conversationId });
  };

  const currentRoleLabel = availableMemberRoles.find(
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
            {availableMemberRoles.map((r) => (
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
