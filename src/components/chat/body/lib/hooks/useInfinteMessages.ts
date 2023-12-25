import { getMessages } from "@/lib/actions/messages/queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Message } from "../types";

type Props = {
  initialMessages: Message[];
  conversationId: string;
};

const take = 25;

export const useInfiniteMessages = ({
  conversationId,
  initialMessages,
}: Omit<Props, "memberRole">) => {
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
