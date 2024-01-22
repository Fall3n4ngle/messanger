import { useQuery } from "@tanstack/react-query";
import { Message } from "../../../lib/types";
import { getMessages } from "@/lib/actions/messages/queries";

type Props = {
  initialMessages: Message[];
  conversationId: string;
};

export const useMessages = ({
  conversationId,
  initialMessages,
}: Props) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages({ conversationId }),
    initialData: initialMessages,
  });
};
