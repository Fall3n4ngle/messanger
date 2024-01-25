"use client";

import UserCard, { UserCardProps } from "@/components/UserCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui";
import AddUserForm from "./AddUserForm";
import { useState } from "react";

type Props = {
  userId: string;
} & UserCardProps;

export default function AddUserButton(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <div role="button" className="cursor-pointer">
                <UserCard {...props} />
              </div>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            Add <span className="font-bold">{props.name}</span> to your
            conversation
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle>Add {props.name} to your conversation</DialogTitle>
          <DialogDescription>
            You can only choose from conversations where you are an admin
          </DialogDescription>
        </DialogHeader>
        <AddUserForm userId={props.userId} onDialogClose={handleDialogClose} />
      </DialogContent>
    </Dialog>
  );
}
