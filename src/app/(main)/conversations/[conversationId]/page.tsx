import { ChatHeader } from "@/components/chat";
import { getConversationById } from "@/lib/actions/conversation/queries";
import { notFound } from "next/navigation";

type Props = {
  params: {
    conversationId: string;
  };
};

export default async function Conversation({
  params: { conversationId },
}: Props) {
  const conversation = await getConversationById(conversationId);
  if (!conversation) notFound();

  const { id, name, image, creatorId, isGroup, messages, users } = conversation;

  return (
    <div className="w-full">
      <ChatHeader
        conversationId={id}
        name={name}
        image={image}
        isGroup={isGroup}
        usersCount={users.length}
        members={users}
      />
    </div>
  );
}
