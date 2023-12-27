import { getUserConversations } from "@/lib/actions/conversation/queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Conversation } from "../types";

type UseInfiniteConversationsProps = {
  currentUserId: string;
  query: string | null;
  intialConversations: Conversation[];
};

const take = 25;

export const useInfiniteConversations = ({
  query,
  currentUserId,
  intialConversations,
}: UseInfiniteConversationsProps) => {
  const getData = async ({ pageParam }: { pageParam?: Date }) => {
    const conversations = await getUserConversations({
      currentUserId,
      query: query ?? "",
      lastCursor: pageParam,
      take,
    });

    return conversations;
  };

  return useInfiniteQuery({
    queryKey: ["conversations", "list", query],
    queryFn: getData,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < take) {
        return;
      }

      return lastPage[lastPage.length - 1].lastMessage?.updatedAt;
    },
    initialData: {
      pages: [intialConversations],
      pageParams: [undefined],
    },
  });
};
