"use client";

import { ScrollArea } from "../ui";
import { formatDate } from "@/lib/utils";
import ConversationCard from "./ConversationCard";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getUserConversations } from "@/lib/actions/conversation/queries";
import { Fragment, useEffect } from "react";
import { pusherClient } from "@/lib/pusher/client";

type Conversation = {
  id: string;
  name: string;
  image: string | null;
  lastMessageAt: Date;
};

type Props = {
  intialConversations: Conversation[];
  currentUserId: string;
};

const take = 25;

export default function ConversationsList({
  intialConversations,
  currentUserId,
}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

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

  if (!data.pages[0].length) {
    return <p className="ml-3">No conversations found</p>;
  }

  return (
    <ScrollArea className="px-4">
      <ul className="flex flex-col gap-3">
        {data.pages.map((group, id) => (
          <Fragment key={id}>
            {group.map(({ id, lastMessageAt, ...props }) => {
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
          </Fragment>
        ))}
      </ul>
      <div ref={bottomRef} />
    </ScrollArea>
  );
}

type UseInfiniteConversationsProps = {
  currentUserId: string;
  query: string | null;
  intialConversations: Conversation[];
};

const useInfiniteConversations = ({
  query,
  currentUserId,
  intialConversations,
}: UseInfiniteConversationsProps) => {
  const getData = async ({ pageParam }: { pageParam?: Date }) => {
    const conversations = await getUserConversations({
      currentUserId,
      query: query ?? "",
      lastCursor: pageParam,
      take,
    });

    return conversations;
  };

  return useInfiniteQuery({
    queryKey: ["conversations", query],
    queryFn: getData,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < take) {
        return;
      }

      return lastPage[lastPage.length - 1].lastMessageAt;
    },
    initialData: {
      pages: [intialConversations],
      pageParams: [undefined],
    },
  });
};

type UsePusherConversationsProps = {
  currentUserId: string;
  query: string | null;
};

const usePusherConversations = ({
  currentUserId,
  query,
}: UsePusherConversationsProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    pusherClient.subscribe(currentUserId);

    const handleNewConversation = (newConversation: Conversation) => {
      queryClient.setQueryData(
        ["conversations", query],
        ({ pageParams, pages }: InfiniteData<Conversation[], unknown>) => {
          return {
            pages: pages.map((page, index) =>
              index === pages.length - 1 ? [...page, newConversation] : page
            ),
            pageParams,
          };
        }
      );
    };

    pusherClient.bind("conversation:new", handleNewConversation);

    return () => {
      pusherClient.unsubscribe(currentUserId);
      pusherClient.unbind("conversation:new", handleNewConversation);
    };
  }, [currentUserId, queryClient, query]);
};
