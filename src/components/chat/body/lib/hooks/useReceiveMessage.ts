import {
  InfiniteData,
  Query,
  QueryKey,
  useQueryClient,
} from "@tanstack/react-query";
import { Message } from "../types";
import { useCallback, useRef } from "react";

type Props = {
  message: Message;
  conversationId: string;
};

export const useReceiveMessage = () => {
  const queryClient = useQueryClient();
  const previousCache = useRef<Query<unknown, Error, unknown, QueryKey>[]>();

  const updateCache = useCallback(
    ({ conversationId, message }: Props) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        ({ pages, pageParams }: InfiniteData<Message[], unknown>) => {
          const newPages = pages.map((page, index) => {
            if (index === pages.length - 1) {
              return [...page, message];
            }

            return page;
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

  const revertCache = useCallback(
    ({ conversationId }: Pick<Props, "conversationId">) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        previousCache.current
      );
    },
    [previousCache, queryClient]
  );

  return {
    updateCache,
    revertCache,
  };
};
