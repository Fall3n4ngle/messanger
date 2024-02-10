"use client";

import { useSearchParams } from "next/navigation";
import {
  usePusherConversations,
  usePusherMessages,
  useInfiniteConversations,
} from "../hooks";
import ConversationsList from "./ConversationsList";
import { useToast } from "@/common/hooks";
import { ToastMessage } from "@/components";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import ConversationCardSkeleton from "./ConversationCardSkeleton";

export default function ConversationsClient() {
  const { toast } = useToast();
  const query = useSearchParams().get("query");

  const { ref: bottomRef, inView } = useInView({
    threshold: 1,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useInfiniteConversations({
      query,
    });

  usePusherConversations();
  usePusherMessages();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (error) {
    toast({
      description: (
        <ToastMessage type="error" message="Failed to load conversations" />
      ),
    });

    return null;
  }

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
