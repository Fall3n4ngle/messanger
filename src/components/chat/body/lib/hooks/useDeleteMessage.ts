import {
  InfiniteData,
  Query,
  QueryKey,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { Message } from "../types";

type Props = {
  messageId: string;
  conversationId: string;
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  const previousCache = useRef<Query<unknown, Error, unknown, QueryKey>[]>();

  const updateCache = useCallback(
    ({ conversationId, messageId }: Props) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        ({ pages, pageParams }: InfiniteData<Message[], unknown>) => {
          let found = false;

          const newPages = pages.map((page) => {
            if (found) return page;

            return page.filter((message) => {
              if (message.id === messageId) {
                found = true;
                return false;
              }

              return true;
            });
          });

          return {
            pages: newPages,
            pageParams,
          };
        }
      );
    },
    [queryClient]
  );

  const revertCache = ({ conversationId }: Pick<Props, "conversationId">) => {
    queryClient.setQueryData(
      ["messages", conversationId],
      previousCache.current
    );
  };

  return {
    updateCache,
    revertCache,
  };
};
