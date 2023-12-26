import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui";
import { ReactNode } from "react";

type Props = {
  name: string;
  image: string | null;
  isActive: boolean;
  lastMessageAt: string;
  lastMessageContent: ReactNode;
};

export default function ConversationCard({
  name,
  image,
  isActive,
  lastMessageAt,
  lastMessageContent,
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 cursor-pointer p-2 dark:hover:bg-secondary/70 hover:bg-secondary/80 rounded-md transition-colors",
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
        <h4 className="scroll-m-20 font-semibold tracking-tight whitespace-nowrap mb-1">
          {name}
        </h4>
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          {lastMessageContent}
        </p>
      </div>
      <time
        dateTime={lastMessageAt}
        className="self-start text-sm mt-[0.1rem]  text-muted-foreground"
      >
        {lastMessageAt}
      </time>
    </div>
  );
}
