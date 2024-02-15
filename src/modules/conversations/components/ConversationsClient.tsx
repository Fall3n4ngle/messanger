"use client";

import { useSearchParams } from "next/navigation";
import {
  usePusherConversations,
  usePusherMessages,
  useInfiniteConversations,
  usePusherMember,
} from "../hooks";
import ConversationsList from "./ConversationsList";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import ConversationCardSkeleton from "./ConversationCardSkeleton";

export default function ConversationsClient() {
  const query = useSearchParams().get("query");

  const { ref: bottomRef, inView } = useInView({
    threshold: 1,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteConversations({
      query,
    });

  usePusherConversations();
  usePusherMessages();
  usePusherMember();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (!data?.pages[0].length) {
    return <p className="pl-3">No conversations found</p>;
  }

  return (
    <>
      <ConversationsList data={data} />
      {isFetchingNextPage && <ConversationCardSkeleton />}
      <div ref={bottomRef} className="pt-4" />
    </>
  );
}
