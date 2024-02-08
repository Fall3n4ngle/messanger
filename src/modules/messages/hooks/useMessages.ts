import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/common/actions/messages/queries";

type Props = {
  conversationId: string;
};

export const useMessages = ({ conversationId }: Props) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages({ conversationId }),
  });
};
