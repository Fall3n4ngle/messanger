import { Message } from "@/common/actions/messages/queries";
import { useActiveUsers } from "@/common/store";
import { cn } from "@/common/utils";
import { Button } from "@/ui";
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
    <>
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "rounded-full absolute right-6 bottom-6 z-10 w-14 h-14 hover:bg-secondary transition-opacity delay-200",
          {
            "visible opacity-100": !isScrolledToBottom,
            "invisible opacity-0": isScrolledToBottom,
          }
        )}
        onClick={scrollToBottom}
        aria-label="Scroll to bottom"
      >
        <ChevronsDown className="text-muted-foreground" />
      </Button>
      <div className="flex-1 flex flex-col gap-6" ref={messagesListRef}>
        {messages.map(({ user, ...props }, messageIndex) => {
          if (!user || !userId) return;
          console.log(user);

          const { clerkId } = user;
          const isOwn = clerkId === userId;
          const isActive = usersIds.includes(clerkId);

          let previousMessageId: string | null = null;
          if (messageIndex > 0) {
            previousMessageId = messages[messageIndex - 1].id;
          }

          const card = getMessageCard({
            ...props,
            isActive,
            isOwn,
            memberRole,
            previousMessageId,
            userId: currentUserId,
            user,
          });

          return card;
        })}
      </div>
      <div ref={bottomRef} />
    </>
  );
}
