"use client";

import { Button, ScrollArea } from "@/components/ui";
import { useEffect, useRef } from "react";
import { useActiveUsers } from "@/store";
import { MemberRole } from "@prisma/client";
import { Message } from "../lib/types";
import { useMessages } from "./lib/hooks/useMessages";
import { useAuth } from "@clerk/nextjs";
import { getMessageCard } from "./lib/utils/getMessageCard";
import { useInView } from "react-intersection-observer";
import { ChevronsDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  initialMessages: Message[];
  conversationId: string;
  memberRole: MemberRole;
  memberId: string;
};

export default function MessagesList({
  conversationId,
  initialMessages,
  memberRole,
  memberId,
}: Props) {
  const { userId } = useAuth();
  const { usersIds } = useActiveUsers();

  const messagesListRef = useRef<HTMLDivElement>(null);
  const { ref: bottomRef, inView: isScrolledToBottom } = useInView();

  const { data: messages, dataUpdatedAt } = useMessages({
    conversationId,
    initialMessages,
  });

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

  if (messages.length < 1) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          No messages yet
        </h3>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-6 pb-6 pt-3 relative">
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
      >
        <ChevronsDown className="text-muted-foreground" />
      </Button>
      <div className="flex-1 flex flex-col gap-6" ref={messagesListRef}>
        {messages.map(({ member, ...props }, messageIndex) => {
          if (!member.user || !userId) return;
          const { clerkId } = member.user;
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
            member,
            memberRole,
            previousMessageId,
            memberId,
          });

          return card;
        })}
      </div>
      <div ref={bottomRef} />
    </ScrollArea>
  );
}
