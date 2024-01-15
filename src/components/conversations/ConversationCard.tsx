import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui";
import { ReactNode } from "react";

type Props = {
  name: string;
  image?: string | null;
  isActive: boolean;
  lastMessageAt: string;
  lastMessageContent: ReactNode;
  unreadMessagesCount: number;
  seen: ReactNode;
};

export default function ConversationCard({
  name,
  image,
  isActive,
  lastMessageAt,
  lastMessageContent,
  unreadMessagesCount,
  seen
}: Props) {
  return (
    <div
      className={cn(
        "flex relative items-center justify-between gap-3 cursor-pointer p-2 dark:hover:bg-secondary/70 hover:bg-secondary/80 rounded-md transition-colors",
        isActive &&
          "bg-secondary hover:bg-secondary/100 dark:hover:bg-secondary/100 cursor-default"
      )}
    >
      <Avatar>
        {image && <AvatarImage src={image} alt={`${name} image`} />}
        <AvatarFallback className={cn(isActive && "bg-background")}>
          {name[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="grow">
        <h4 className="scroll-m-20 font-semibold tracking-tight whitespace-nowrap mb-1.5">
          {name}
        </h4>
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          {lastMessageContent}
        </p>
      </div>
      <div className="absolute top-[9px] right-2 text-sm text-muted-foreground flex items-center gap-1">
        {seen}
        <time>
          {lastMessageAt}
        </time>
      </div>
      {unreadMessagesCount > 0 ? (
        <div className="self-end text-xs text-center p-[3px] bg-primary rounded-full min-w-[21px] relative bottom-0.5">
          {unreadMessagesCount}
        </div>
      ) : null}
    </div>
  );
}
