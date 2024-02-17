"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui";
import { UserForm } from "@/components";
import { useActiveUsers } from "@/common/store/useActiveUsers";
import { cn } from "@/common/utils";
import { useState } from "react";

type Props = {
  image: string | null;
  name: string;
  clerkId: string;
  id: string;
};

export default function UserButton({ image, name, clerkId, id }: Props) {
  const { usersIds } = useActiveUsers();
  const [isOpen, setIsOpen] = useState(false);

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const isActive = usersIds.includes(clerkId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <div
                role="button"
                className="relative"
                aria-label="open profile dialog"
              >
                <Avatar>
                  {image && (
                    <AvatarImage
                      src={image}
                      alt="Profile picture"
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-muted-foreground",
                    isActive && "bg-green-400",
                  )}
                />
              </div>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">Update profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Change your display name or image
          </DialogDescription>
        </DialogHeader>
        <UserForm
          clerkId={clerkId}
          name={name}
          image={image}
          id={id}
          onCloseModal={handleModalClose}
        />
      </DialogContent>
    </Dialog>
  );
}
