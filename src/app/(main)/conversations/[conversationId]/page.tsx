import { getConversationById } from "@/lib/actions/conversation/queries";

type Props = {
  params: {
    conversationId: string;
  };
};

export default async function Conversation({
  params: { conversationId },
}: Props) {
  const conversation = await getConversationById(conversationId);

  return <div>{conversationId}</div>;
}
