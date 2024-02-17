import { CheckCheck } from "lucide-react";
import { cn } from ".";

type GetMessageSeen = {
  isOwn: boolean;
  isSeen: boolean;
};

export const getMessageSeen = ({ isOwn, isSeen }: GetMessageSeen) => {
  if (!isOwn) return null;

  return (
    <CheckCheck
      className={cn("h-4 w-4 text-muted-foreground", isSeen && "text-primary")}
    />
  );
};
