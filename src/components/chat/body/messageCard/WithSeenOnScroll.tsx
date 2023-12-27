"use client";

import { FormMessage } from "@/components/common";
import { Conversation } from "@/components/conversations/lib/types";
import { markAsSeen } from "@/lib/actions/messages/mutations";
import { useToast } from "@/lib/hooks";
import {
  InfiniteData,
  Query,
  QueryKey,
  useQueryClient,
} from "@tanstack/react-query";
import { PropsWithChildren, useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  messageId: string;
  memberId: string;
  seen: boolean;
  conversationId: string;
} & PropsWithChildren;

let previousCache: Query<unknown, Error, unknown, QueryKey>[];

export default function WithSeenOnScroll({
  memberId,
  messageId,
  seen,
  children,
  conversationId,
}: Props) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { ref, inView } = useInView({
    threshold: 1,
  });

  const updateCache = useCallback(() => {
    const queryCache = queryClient.getQueryCache();
    let found = false;
    let updatedConversation: Conversation;
    let newPages: Conversation[][] = [];
    const prev = queryCache.findAll({
      queryKey: ["conversations"],
    });

    previousCache = prev;

    prev.forEach(({ queryKey }) => {
      const oldData = queryClient.getQueryData(queryKey) as InfiniteData<
        Conversation[],
        unknown
      >;
      if (!found) {
        newPages = oldData.pages.map((page) => {
          if (found) return page;

          return page.map((conversation) => {
            if (conversation.id === conversationId) {
              found = true;

              updatedConversation = {
                ...conversation,
                messages: [
                  ...conversation.messages.filter(
                    (message) => message.id !== messageId
                  ),
                ],
              };

              return updatedConversation;
            }

            return conversation;
          });
        });
      }

      if (found) {
        queryClient.setQueryData(queryKey, {
          ...oldData,
          pages: newPages,
        });
      }
    });
  }, [conversationId, messageId, queryClient]);

  useEffect(() => {
    if (inView && !seen) {
      updateCache();

      (async function () {
        const response = await markAsSeen({
          memberId,
          messageId,
          conversationId,
        });

        if (response.error) {
          queryClient.setQueryData(["conversations"], previousCache);

          toast({
            description: (
              <FormMessage
                type="error"
                message="Failed to mark message as seen"
              />
            ),
          });
        }
      })();
    }
  }, [
    inView,
    seen,
    memberId,
    messageId,
    conversationId,
    updateCache,
    queryClient,
    toast,
  ]);

  return <div ref={ref}>{children}</div>;
}
