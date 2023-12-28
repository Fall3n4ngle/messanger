import { Conversation } from "@/components/conversations/lib/types";
import {
  InfiniteData,
  Query,
  QueryKey,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useRef } from "react";

type Props = {
  conversationId: string;
  messageId: string;
};

export const useMarkAsSeen = ({ conversationId, messageId }: Props) => {
  const queryClient = useQueryClient();
  const previousCache = useRef<Query<unknown, Error, unknown, QueryKey>[]>();

  const updateCache = useCallback(() => {
    const queryCache = queryClient.getQueryCache();
    let found = false;
    let updatedConversation: Conversation;
    let newPages: Conversation[][] = [];
    const prev = queryCache.findAll({
      queryKey: ["conversations"],
    });

    previousCache.current = prev;

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

  return {
    updateCache,
    previousCache,
  };
};
