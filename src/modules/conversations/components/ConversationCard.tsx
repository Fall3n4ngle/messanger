import { cn } from "@/common/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui";
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
  seen,
}: Props) {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer items-center justify-between gap-3 rounded-md p-2 transition-colors hover:bg-secondary/70 dark:hover:bg-secondary/60",
        isActive &&
          "cursor-default bg-secondary/90 hover:bg-secondary/90 dark:hover:bg-secondary/90",
      )}
    >
      <Avatar>
        {image && <AvatarImage src={image} alt={`${name} image`} />}
        <AvatarFallback className="bg-primary text-primary-foreground">
          {name && name[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="grow">
        <h4 className="mb-1.5 scroll-m-20 whitespace-nowrap font-semibold tracking-tight">
          {name}
        </h4>
        <p className="whitespace-nowrap text-sm text-muted-foreground">
          {lastMessageContent}
        </p>
      </div>
      <div className="absolute right-2 top-[9px] flex items-center gap-1 text-sm text-muted-foreground">
        {seen}
        <time>{lastMessageAt}</time>
      </div>
      {unreadMessagesCount > 0 ? (
        <div className="relative bottom-0.5 min-w-[21px] self-end rounded-full bg-primary p-[3px] text-center text-xs text-primary-foreground">
          {unreadMessagesCount}
        </div>
      ) : null}
    </div>
  );
}
