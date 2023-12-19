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
} from "../ui";
import { UserForm } from "../common";
import { useAuth } from "@clerk/nextjs";
import { useActiveUsers } from "@/store/useActiveUsers";
import { cn } from "@/lib/utils";

type Props = {
  image: string | null;
  name: string;
  clerkId: string;
};

export default function UserButton({ image, name, clerkId }: Props) {
  const { userId } = useAuth();
  const { usersIds } = useActiveUsers();

  const isActive = userId && usersIds.includes(userId);

  return (
    <Dialog>
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
                    "absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-muted-foreground border-2 border-background",
                    isActive && "bg-green-400"
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
        <UserForm clerkId={clerkId} name={name} image={image} />
      </DialogContent>
    </Dialog>
  );
}
