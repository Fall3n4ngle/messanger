import {
  getConversationsForSelect,
  GetConversationsProps,
} from "@/lib/actions/conversation/queries";

export const loadConversations = async (props: GetConversationsProps) => {
  const conversations = await getConversationsForSelect(props);

  return conversations.map((conversation) => ({
    value: conversation.id,
    label: conversation.name,
    image: conversation.image,
  }));
};
