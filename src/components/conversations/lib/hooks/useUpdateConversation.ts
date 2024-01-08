import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Conversation } from "../types";
import { UpdateConversationEvent } from "@/lib/actions/conversation/mutations";

export const useUpdateConversation = () => {
  const queryClient = useQueryClient();

  const updateCache = useCallback(
    ({ id, ...data }: UpdateConversationEvent) => {
      queryClient.setQueriesData(
        {
          queryKey: ["conversations"],
        },
        (
          oldData:
            | { pageParams: unknown[]; pages: Conversation[][] }
            | undefined
        ) => {
          if (!oldData) {
            return {
              pageParams: [],
              pages: [],
            };
          }

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => {
              let found = false;

              if (found) return page;

              return page.map((conversation) => {
                if (conversation.id === id) {
                  found = true;
                  return { ...conversation, ...data };
                }

                return conversation;
              });
            }),
          };
        }
      );
    },
    [queryClient]
  );

  return { updateCache };
};
