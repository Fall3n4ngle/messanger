import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Conversation } from "../types";

export const useNewConversation = () => {
  const queryClient = useQueryClient();

  const updateCache = useCallback(
    (newConversation: Conversation) => {
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
              pages: [[newConversation]],
            };
          }

          const { pageParams, pages } = oldData;

          return {
            pageParams,
            pages: pages.map((page, index) =>
              index === 0 ? [newConversation, ...page] : page
            ),
          };
        }
      );
    },
    [queryClient]
  );

  return { updateCache };
};
