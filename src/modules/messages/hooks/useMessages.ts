import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/common/actions/messages/queries";
import { messageKeys } from "@/common/const";

type Props = {
  conversationId: string;
};

export const useMessages = ({ conversationId }: Props) => {
  return useQuery({
    queryKey: messageKeys.list(conversationId),
    queryFn: () => getMessages({ conversationId }),
    throwOnError: true,
  });
};
