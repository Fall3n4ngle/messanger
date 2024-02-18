import { getUserConversations } from "@/common/actions/conversation/queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CONVERSATIONS_PER_PAGE } from "../const";
import { conversationKeys } from "@/common/const";

export const useInfiniteConversations = () => {
  const getData = async ({ pageParam }: { pageParam?: string }) => {
    return await getUserConversations({
      lastCursor: pageParam,
      take: CONVERSATIONS_PER_PAGE,
    });
  };

  return useInfiniteQuery({
    queryKey: conversationKeys.lists(),
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
