"use client";

import { Button, ScrollArea } from "@/components/ui";
import { Fragment, useCallback, useEffect, useRef } from "react";
import { useActiveUsers } from "@/store";
import { MemberRole } from "@prisma/client";
import { Message } from "../lib/types";
import { useInfiniteMessages } from "./lib/hooks/useInfinteMessages";
import { usePusherMessages } from "./lib/hooks/usePusherMessages";
import { useAuth } from "@clerk/nextjs";
import { getMessageCard } from "./lib/utils/getMessageCard";
import { useInView } from "react-intersection-observer";

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

  const { data, fetchPreviousPage, hasPreviousPage, dataUpdatedAt } =
    useInfiniteMessages({
      conversationId,
      initialMessages,
    });

  usePusherMessages();

  const scrollToBottom = useCallback(() => {
    const messagesList = messagesListRef.current;
    if (!messagesList || !isScrolledToBottom) return;

    messagesList.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [isScrolledToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [dataUpdatedAt, scrollToBottom]);

  if (!data.pages[0].length) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          No messages yet
        </h3>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-6 pb-6 pt-3">
      {hasPreviousPage && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => fetchPreviousPage()}
          >
            Load previous
          </Button>
        </div>
      )}
      <div className="flex-1 flex flex-col gap-6" ref={messagesListRef}>
        {data?.pages.map((group, groupIndex) => (
          <Fragment key={groupIndex}>
            {group.map(({ member, ...props }, messageIndex) => {
              if (!member.user || !userId) return;
              const { clerkId } = member.user;
              const isOwn = clerkId === userId;
              const isActive = usersIds.includes(clerkId);

              let previousMessageId: string | null = null;

              if (messageIndex >= 1) {
                previousMessageId = group[messageIndex - 1].id;
              } else {
                if (groupIndex >= 1) {
                  const previousGroup = data.pages[groupIndex - 1];
                  previousMessageId =
                    previousGroup[previousGroup.length - 1].id;
                }
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
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </ScrollArea>
  );
}
