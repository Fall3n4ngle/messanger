import { Message } from "@/common/actions/messages/queries";
import { useActiveUsers } from "@/common/store";
import { cn } from "@/common/utils";
import { Button, ScrollArea } from "@/ui";
import { useAuth } from "@clerk/nextjs";
import { ChevronsDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { getMessageCard } from "../utils/getMessageCard";
import { MemberRole } from "@prisma/client";

type Props = {
  dataUpdatedAt: number;
  messages: Message[];
  memberRole: MemberRole;
  currentUserId: string;
};

export default function MessagesList({
  dataUpdatedAt,
  messages,
  currentUserId,
  memberRole,
}: Props) {
  const { userId } = useAuth();
  const { usersIds } = useActiveUsers();

  const messagesListRef = useRef<HTMLDivElement>(null);
  const { ref: bottomRef, inView: isScrolledToBottom } = useInView();

  const scrollToBottom = () => {
    messagesListRef.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    if (!isScrolledToBottom) return;
    scrollToBottom();
  }, [dataUpdatedAt, isScrolledToBottom]);

  return (
    <ScrollArea className="relative h-full flex-1 px-4 py-6 md:px-6">
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "absolute bottom-6 right-6 z-10 h-14 w-14 rounded-full transition-opacity delay-200 hover:bg-secondary",
          {
            "visible opacity-100": !isScrolledToBottom,
            "invisible opacity-0": isScrolledToBottom,
          },
        )}
        onClick={scrollToBottom}
        aria-label="Scroll to bottom"
      >
        <ChevronsDown className="text-muted-foreground" />
      </Button>
      <div className="flex flex-1 flex-col gap-6" ref={messagesListRef}>
        {messages.map(({ user, ...props }) => {
          if (!user || !userId) return;

          const { clerkId } = user;
          const isOwn = clerkId === userId;
          const isActive = usersIds.includes(clerkId);

          const card = getMessageCard({
            ...props,
            isActive,
            isOwn,
            memberRole,
            userId: currentUserId,
            user,
          });

          return card;
        })}
      </div>
      <div ref={bottomRef} />
    </ScrollArea>
  );
}
