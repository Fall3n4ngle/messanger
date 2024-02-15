import { useQuery } from "@tanstack/react-query";
import { getConversationById } from "../actions/conversation/queries";
import { conversationKeys } from "../const";

type Props = {
  conversationId: string;
};

export const useConversation = ({ conversationId }: Props) => {
  return useQuery({
    queryKey: conversationKeys.detail(conversationId),
    queryFn: () => getConversationById(conversationId),
    throwOnError: true,
  });
};
