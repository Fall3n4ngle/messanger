import {
  UserConversation,
  getUserConversations,
} from "@/common/actions/conversation/queries";
import { useQuery } from "@tanstack/react-query";

type UseInfiniteConversationsProps = {
  currentUserId: string;
  query: string | null;
  intialConversations: UserConversation[];
};

export const useConversations = ({
  currentUserId,
  intialConversations,
  query,
}: UseInfiniteConversationsProps) => {
  return useQuery({
    queryKey: ["conversations", query],
    queryFn: () =>
      getUserConversations({ userId: currentUserId, query: query ?? "" }),
    initialData: intialConversations,
  });
};
