import { pusherClient } from "@/lib/pusher/client";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Conversation } from "../types";
import { NewMessage } from "@/lib/actions/messages/mutations";

type UsePusherConversationsProps = {
  currentUserId: string;
  query: string | null;
};

export const usePusherConversations = ({
  currentUserId,
  query,
}: UsePusherConversationsProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    pusherClient.subscribe(currentUserId);

    const handleNewConversation = (newConversation: Conversation) => {
      const queryCache = queryClient.getQueryCache();
      queryCache
        .findAll({
          queryKey: ["conversations"],
        })
        .forEach(({ queryKey }) => {
          queryClient.setQueryData(
            queryKey,
            ({ pageParams, pages }: InfiniteData<Conversation[], unknown>) => {
              return {
                pages: pages.map((page, index) =>
                  index === pages.length - 1 ? [...page, newConversation] : page
                ),
                pageParams,
              };
            }
          );
        });
    };

    const handleNewMessage = ({ id, ...data }: NewMessage) => {
      const queryCache = queryClient.getQueryCache();
      let found = false;
      let updatedConversation: Conversation;
      let newPages: Conversation[][] = [];

      queryCache
        .findAll({
          queryKey: ["conversations"],
        })
        .forEach(({ queryKey }) => {
          const oldData = queryClient.getQueryData(queryKey) as InfiniteData<
            Conversation[],
            unknown
          >;
          if (!found) {
            newPages = oldData.pages.map((page) => {
              if (found) return page;

              return page.map((conversation) => {
                if (conversation.id === id) {
                  found = true;

                  updatedConversation = {
                    ...conversation,
                    ...data,
                  };

                  return updatedConversation;
                }

                return conversation;
              });
            });

            if (updatedConversation) {
              newPages[0] = [
                updatedConversation,
                ...newPages[0].filter((conversation) => conversation.id !== id),
              ];
            }
          }

          if (found) {
            queryClient.setQueryData(queryKey, {
              ...oldData,
              pages: newPages,
            });
          }
        });
    };

    const handleConversationUpdate = (updatedConversation: Conversation) => {
      const queryCache = queryClient.getQueryCache();
      queryCache
        .findAll({
          queryKey: ["conversations"],
        })
        .forEach(({ queryKey }) => {
          queryClient.setQueryData(
            queryKey,
            ({ pageParams, pages }: InfiniteData<Conversation[], unknown>) => {
              let found = false;

              return {
                pages: pages.map((page) => {
                  if (found) return page;

                  return page.map((conversation) => {
                    if (conversation.id === updatedConversation.id) {
                      found = true;

                      return {
                        ...conversation,
                        ...updatedConversation,
                      };
                    }

                    return conversation;
                  });
                }),
                pageParams,
              };
            }
          );
        });
    };

    pusherClient.bind("group:new", handleNewConversation);
    pusherClient.bind("conversation:new_message", handleNewMessage);
    pusherClient.bind("group:update", handleConversationUpdate);

    return () => {
      pusherClient.unsubscribe(currentUserId);
      pusherClient.unbind("conversation:new", handleNewConversation);
      pusherClient.unbind("conversation:new_message", handleNewMessage);
      pusherClient.unbind("group:update", handleConversationUpdate);
    };
  }, [currentUserId, queryClient, query]);
};
