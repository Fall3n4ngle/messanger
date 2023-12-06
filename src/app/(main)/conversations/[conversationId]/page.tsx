import { MessageForm, ChatHeader } from "@/components/chat";
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
    <div className="w-full relative">
      <div className="absolute top-0 left-0 w-full">
        <ChatHeader
          conversationId={id}
          name={name}
          image={image}
          isGroup={isGroup}
          usersCount={users.length}
          members={users}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full py-5 px-6 border-t">
        <MessageForm conversationId={id} />
      </div>
    </div>
  );
}
