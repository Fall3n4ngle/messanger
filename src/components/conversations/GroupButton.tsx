import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui";
import { UserPlus } from "lucide-react";
import { CreateGroupButton } from "./CreateGroupForm";

export default function GroupButton() {
  return (
    <Dialog>
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create group</DialogTitle>
          <DialogDescription>
            Choose group name, image and add other users
          </DialogDescription>
        </DialogHeader>
        <CreateGroupButton />
      </DialogContent>
    </Dialog>
  );
}
