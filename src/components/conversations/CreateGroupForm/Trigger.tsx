import {
  Button,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { UserPlus } from "lucide-react";

export const Trigger = () => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Create group conversation"
            className="rounded-full"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
      </TooltipTrigger>
      <TooltipContent>Create group</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
