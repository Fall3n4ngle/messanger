import { GetConversationsProps } from "@/common/actions/conversation/queries";
import { getConversationsForSelect } from "../actions/conversation";

export const loadConversations = async (props: GetConversationsProps) => {
  const conversations = await getConversationsForSelect(props);

  return conversations.map((conversation) => ({
    value: conversation.id,
    label: conversation.name,
    image: conversation.image,
  }));
};
