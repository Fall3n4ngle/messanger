import { getUserConversations } from "@/common/actions/conversation/queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CONVERSATIONS_PER_PAGE } from "../const";
import { conversationKeys } from "@/common/const";

type Props = {
  query: string;
};

export const useInfiniteConversations = ({ query }: Props) => {
  const getData = async ({ pageParam }: { pageParam?: string }) => {
    return await getUserConversations({
      lastCursor: pageParam,
      query,
      take: CONVERSATIONS_PER_PAGE,
    });
  };

  return useInfiniteQuery({
    queryKey: conversationKeys.list(query),
    queryFn: getData,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < CONVERSATIONS_PER_PAGE) {
        return;
      }

      return lastPage[lastPage.length - 1].id;
    },
    throwOnError: true,
  });
};
