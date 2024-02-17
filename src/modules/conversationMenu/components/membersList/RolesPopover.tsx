import { availableMemberRoles } from "@/common/const";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/ui";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { ChangeRoleFields } from "../../validations/member";
import RolesCommand from "./RolesCommand";

export default function RolesPopover(props: ChangeRoleFields) {
  const [isOpen, setIsOpen] = useState(false);

  const currentRoleLabel = availableMemberRoles.find(
    (r) => r.value === props.role,
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
        <RolesCommand {...props} />
      </PopoverContent>
    </Popover>
  );
}
