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
      className={cn("text-muted-foreground w-4 h-4", isSeen && "text-primary")}
    />
  );
};
