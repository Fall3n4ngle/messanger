"use client";

import { ScrollArea } from "../ui";
import { formatDate } from "@/lib/utils";
import ConversationCard from "./ConversationCard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type Conversation = {
  id: string;
  name: string;
  image: string | null;
  lastMessageAt: Date;
};

type Props = {
  intialConversations: Conversation[];
};

export default function ConversationsList({ intialConversations }: Props) {
  const pathname = usePathname();
  const [page, setPage] = useState(1)
  const [conversations, setConversations] = useState(intialConversations);
  const { ref: bottomRef, inView } = useInView({
    threshold: 0,
  });

  

  return (
    <ScrollArea className="px-4">
      {intialConversations.length > 0 ? (
        <>
          <ul className="flex flex-col gap-3">
            {conversations.map(({ id, lastMessageAt, ...props }) => {
              const date = formatDate(lastMessageAt);
              const isActive = pathname.includes(id);

              return (
                <li key={id}>
                  <Link href={`/conversations/${id}`}>
                    <ConversationCard
                      isActive={isActive}
                      lastMessageAt={date}
                      {...props}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div ref={bottomRef} />
        </>
      ) : (
        <p className="text-muted-foreground">No conversations yet</p>
      )}
    </ScrollArea>
  );
}
