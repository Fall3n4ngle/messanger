"use client";

import { Button, ScrollArea } from "@/components/ui";
import { Fragment, useEffect, useRef } from "react";
import MessageCard from "./MessageCard";
import { useActiveUsers } from "@/store";
import { MemberRole } from "@prisma/client";
import MessageCardWithControls from "./MessageCardWithControls";
import { Message } from "./lib/types";
import { useInfiniteMessages } from "./lib/hooks/useInfinteMessages";
import { usePusherMessages } from "./lib/hooks/usePusherMessages";
import { useAuth } from "@clerk/nextjs";

type Props = {
  initialMessages: Message[];
  conversationId: string;
  memberRole: MemberRole;
};

export default function MessagesList({
  conversationId,
  initialMessages,
  memberRole,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();
  const { usersIds } = useActiveUsers();

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { data, fetchPreviousPage, hasPreviousPage } = useInfiniteMessages({
    conversationId,
    initialMessages,
  });

  usePusherMessages({ conversationId });

  useEffect(() => {
    scrollToBottom();
  }, []);

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
    <ScrollArea className="flex-1 px-6 pb-6 pt-3" ref={listRef}>
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
      <div className="flex-1 flex flex-col gap-6">
        {data?.pages.map((group, id) => (
          <Fragment key={id}>
            {group.map((message) => {
              if (!message.member.user) return;
              const { clerkId } = message.member.user;
              const isOwn = clerkId === userId;
              const isActive = usersIds.includes(clerkId);

              if (memberRole !== "VIEW" || isOwn) {
                return (
                  <MessageCardWithControls
                    key={message.id}
                    isOwn={isOwn}
                    isActive={isActive}
                    {...message}
                  />
                );
              }

              return (
                <MessageCard
                  key={message.id}
                  isOwn={isOwn}
                  isActive={isActive}
                  {...message}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </ScrollArea>
  );
}