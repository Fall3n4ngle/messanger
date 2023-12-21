"use client";

import { Button, ScrollArea } from "@/components/ui";
import { getMessages } from "@/lib/actions/messages/queries";
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Fragment, useEffect, useRef } from "react";
import MessageCard from "./MessageCard";
import { pusherClient } from "@/lib/pusher/client";
import { useAuth } from "@clerk/nextjs";
import { useActiveUsers } from "@/store";
import { MemberRole } from "@prisma/client";
import MessageCardWithControls from "./MessageCardWithControls";
import { UpdateMessage } from "@/lib/actions/messages/mutations";
import { useMessage } from "@/store/useMessage";

export type Message = {
  id: string;
  content: string | null;
  file: string | null;
  updatedAt: Date;
  conversationId: string;
  member: {
    id: string;
    role: MemberRole;
    user: {
      image: string | null;
      name: string;
      clerkId: string;
    };
  };
};

type Props = {
  initialMessages: Message[];
  conversationId: string;
};

const take = 25;

export default function MessagesList({
  conversationId,
  initialMessages,
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

              return (
                <MessageCardWithControls
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

const useInfiniteMessages = ({ conversationId, initialMessages }: Props) => {
  const getData = async ({ pageParam }: { pageParam?: string }) => {
    const messages = await getMessages({
      conversationId,
      lastCursor: pageParam,
      take: -take,
    });

    return messages;
  };

  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: getData,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < +take) {
        return;
      }

      return lastPage[lastPage.length - 1].id;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.length < +take) {
        return;
      }

      return firstPage[0].id;
    },
    initialData: {
      pages: [initialMessages],
      pageParams: [undefined],
    },
    staleTime: Infinity,
  });
};

const usePusherMessages = ({ conversationId }: { conversationId: string }) => {
  const queryClient = useQueryClient();
  const { setMessage } = useMessage();

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const handleNewMessage = (newMessage: Message) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        ({ pageParams, pages }: InfiniteData<Message[], unknown>) => {
          return {
            pages: pages.map((page, index) =>
              index === pages.length - 1 ? [...page, newMessage] : page
            ),
            pageParams,
          };
        }
      );
    };

    const handleDeleteMessage = ({ id }: { id: string }) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        (oldData: InfiniteData<Message[], unknown>) => {
          let found = false;

          const newData = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (found) return page;

              const newPage = page.filter((message) => {
                if (message.id === id) {
                  found = true;
                  return false;
                }

                return true;
              });

              return newPage;
            }),
          };
          return newData;
        }
      );
    };

    const handleUpdateMessage = ({ id, content, file }: UpdateMessage) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        (oldData: InfiniteData<Message[], unknown>) => {
          let found = false;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (found) return page;

              const newPage = page.map((message) => {
                if (message.id === id) {
                  found = true;

                  return {
                    ...message,
                    file,
                    content,
                  } as Message;
                }

                return message;
              });

              return newPage;
            }),
          };
        }
      );

      setMessage({ id: undefined, file: "", content: "" });
    };

    pusherClient.bind("messages:new", handleNewMessage);
    pusherClient.bind("messages:delete", handleDeleteMessage);
    pusherClient.bind("messages:update", handleUpdateMessage);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", handleNewMessage);
      pusherClient.unbind("messages:delete", handleDeleteMessage);
      pusherClient.unbind("messages:update", handleUpdateMessage);
    };
  }, [conversationId, queryClient, setMessage]);
};
