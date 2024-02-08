import { useQuery } from "@tanstack/react-query";
import { getConversationById } from "../actions/conversation/queries";

type Props = {
  conversationId: string;
};

export const useConversation = ({ conversationId }: Props) => {
  return useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => getConversationById(conversationId),
    enabled: !!conversationId,
  });
};
