import { getUserConversations } from "@/common/actions/conversation/queries";
import { useQuery } from "@tanstack/react-query";

type UseInfiniteConversationsProps = {
  query: string | null;
};

export const useConversations = ({ query }: UseInfiniteConversationsProps) => {
  return useQuery({
    queryKey: ["conversations", "list", query],
    queryFn: () => getUserConversations({ query: query ?? "" }),
  });
};
