"use client";

import { ScrollArea } from "../ui";
import { formatDate } from "@/lib/utils";
import ConversationCard from "./ConversationCard";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { Conversation } from "./lib/types";
import { useInfiniteConversations } from "./lib/hooks/useInfiniteConversations";
import { usePusherConversations } from "./lib/hooks/usePusherConversations";
import { Fragment, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { getLastMessageData } from "./lib/utils/getLastMessage";

type Props = {
  intialConversations: Conversation[];
  currentUserId: string;
};

export default function ConversationsList({
  intialConversations,
  currentUserId,
}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const { userId } = useAuth();

  const { ref: bottomRef, inView } = useInView({
    threshold: 0,
  });

  const { data, fetchNextPage, hasNextPage } = useInfiniteConversations({
    currentUserId,
    query,
    intialConversations,
  });

  usePusherConversations({ currentUserId, query });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (!userId) {
    return null;
  }

  if (!data.pages[0].length) {
    return <p className="pl-3">No conversations found</p>;
  }

  return (
    <ScrollArea className="px-4">
      <ul className="flex flex-col gap-3">
        {data.pages.map((group, id) => (
          <Fragment key={id}>
            {group.map(
              ({
                id,
                lastMessage,
                messages: unreadMessages,
                updatedAt,
                isGroup,
                ...props
              }) => {
                const date = formatDate(lastMessage?.updatedAt ?? updatedAt);
                const isActive = pathname.includes(id);
                const unreadMessagesCount = unreadMessages.length;
                const { message, seen } = getLastMessageData({
                  currentUserClerkId: userId,
                  isGroup,
                  lastMessage,
                });

                return (
                  <li key={id}>
                    <Link href={`/conversations/${id}`}>
                      <ConversationCard
                        isActive={isActive}
                        lastMessageAt={date}
                        lastMessageContent={message}
                        unreadMessagesCount={unreadMessagesCount}
                        seen={seen}
                        {...props}
                      />
                    </Link>
                  </li>
                );
              }
            )}
          </Fragment>
        ))}
      </ul>
      <div ref={bottomRef} />
    </ScrollArea>
  );
}
