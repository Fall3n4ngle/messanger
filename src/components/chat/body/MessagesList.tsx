"use client";

import { Button, ScrollArea } from "@/components/ui";
import { Fragment, useRef } from "react";
import { useActiveUsers } from "@/store";
import { MemberRole } from "@prisma/client";
import { MessageCard, WithControls, WithSeenOnScroll } from "./messageCard";
import { Message } from "./lib/types";
import { useInfiniteMessages } from "./lib/hooks/useInfinteMessages";
import { usePusherMessages } from "./lib/hooks/usePusherMessages";
import { useAuth } from "@clerk/nextjs";

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
  
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { data, fetchPreviousPage, hasPreviousPage } = useInfiniteMessages({
    conversationId,
    initialMessages,
  });

  usePusherMessages({ conversationId });

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
      <div className="flex-1 flex flex-col gap-6">
        {data?.pages.map((group, id) => (
          <Fragment key={id}>
            {group.map(
              (
                { id, member, seenBy, conversationId, updatedAt, ...props },
                index
              ) => {
                if (!member.user || !userId) return;
                const { clerkId } = member.user;
                const isOwn = clerkId === userId;
                const isActive = usersIds.includes(clerkId);
                const seenByMember = seenBy.find((m) => m.id === member.id)
                  ? true
                  : false;

                let result = (
                  <MessageCard
                    key={id}
                    isOwn={isOwn}
                    isActive={isActive}
                    updatedAt={updatedAt}
                    member={member}
                    {...props}
                  />
                );

                if (isOwn || memberRole !== "VIEW") {
                  result = (
                    <WithControls
                      conversationId={conversationId}
                      messageId={id}
                      key={id}
                      {...props}
                    >
                      {result}
                    </WithControls>
                  );
                }

                if (!isOwn || !seenByMember) {
                  result = (
                    <WithSeenOnScroll
                      memberId={memberId}
                      messageId={id}
                      seen={seenByMember}
                      conversationId={conversationId}
                      key={id}
                    >
                      {result}
                    </WithSeenOnScroll>
                  );
                }

                return result;
              }
            )}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </ScrollArea>
  );
}
