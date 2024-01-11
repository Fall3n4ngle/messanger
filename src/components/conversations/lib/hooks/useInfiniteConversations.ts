import { getUserConversations } from "@/lib/actions/conversation/queries";
import { useQuery } from "@tanstack/react-query";
import { Conversation } from "../types";

type UseInfiniteConversationsProps = {
  currentUserId: string;
  query: string | null;
  intialConversations: Conversation[];
};

export const useConversations = ({
  currentUserId,
  intialConversations,
  query,
}: UseInfiniteConversationsProps) => {
  return useQuery({
    queryKey: ["conversations", query],
    queryFn: () => getUserConversations({ currentUserId, query: query ?? "" }),
    initialData: intialConversations,
  });
};
