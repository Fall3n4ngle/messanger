import {
  UserConversation,
  getUserConversations,
} from "@/common/actions/conversation/queries";
import { useQuery } from "@tanstack/react-query";

type UseInfiniteConversationsProps = {
  query: string | null;
  intialConversations: UserConversation[];
};

export const useConversations = ({
  intialConversations,
  query,
}: UseInfiniteConversationsProps) => {
  return useQuery({
    queryKey: ["conversations", query],
    queryFn: () => getUserConversations({ query: query ?? "" }),
    initialData: intialConversations,
  });
};
