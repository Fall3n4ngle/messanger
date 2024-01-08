import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Conversation } from "../types";

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  const updateCache = useCallback(
    (conversationId: string) => {
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

          const { pageParams, pages } = oldData;

          return {
            pageParams,
            pages: pages.map((page) => {
              let found = false;

              if (found) return page;

              return page.filter((conversation) => {
                if (conversation.id === conversationId) {
                  found = true;
                  return false;
                }

                return true;
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
