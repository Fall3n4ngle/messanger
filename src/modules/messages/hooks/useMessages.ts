import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/common/actions/messages/queries";
import { Message } from "@/common/actions/messages/queries";

type Props = {
  initialMessages: Message[];
  conversationId: string;
};

export const useMessages = ({ conversationId, initialMessages }: Props) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages({ conversationId }),
    initialData: initialMessages,
  });
};
