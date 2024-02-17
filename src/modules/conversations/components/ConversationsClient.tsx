"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteConversations } from "../hooks/useInfiniteConversations";
import ConversationCardSkeleton from "./ConversationCardSkeleton";
import ConversationsList from "./ConversationsList";

export default function ConversationsClient() {
  const query = useSearchParams().get("query") ?? "";

  const { ref: bottomRef, inView } = useInView({
    threshold: 1,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteConversations({ query });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (!data?.pages[0].length) {
    return <p className="pl-3">No conversations found</p>;
  }

  return (
    <>
      <ConversationsList conversations={data.pages} />
      {isFetchingNextPage && <ConversationCardSkeleton />}
      <div ref={bottomRef} className="pt-4" />
    </>
  );
}
