import {
  InfiniteData,
  Query,
  QueryKey,
  useQueryClient,
} from "@tanstack/react-query";
import { Message } from "../../body/lib/types";
import { useCallback, useRef } from "react";

type Props = {
  conversationId: string;
  newMessage: Message;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const previousCache = useRef<Query<unknown, Error, unknown, QueryKey>[]>();

  const updateCache = useCallback(
    ({ conversationId, newMessage }: Props) => {
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
    [queryClient]
  );

  return {
    updateCache,
    revertCache,
  };
};
