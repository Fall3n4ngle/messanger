import { getConversationsForSelect } from "../actions/conversation";
import { GetConversationsProps } from "../types";

export const loadConversations = async (props: GetConversationsProps) => {
  const conversations = await getConversationsForSelect(props);

  return conversations.map((conversation) => ({
    value: conversation.id,
    label: conversation.name,
    image: conversation.image,
  }));
};
