import { MessageForm, ChatHeader, MessagesList } from "@/components/chat";
import { getConversationById } from "@/lib/actions/conversation/queries";
import { getMessages } from "@/lib/actions/messages/queries";
import { notFound } from "next/navigation";

type Props = {
  params: {
    conversationId: string;
  };
};

export default async function Conversation({
  params: { conversationId },
}: Props) {
  const conversationPromise = getConversationById(conversationId);
  const messagesPromise = getMessages({ conversationId, take: -25 });

  const [conversation, messages] = await Promise.all([
    conversationPromise,
    messagesPromise,
  ]);

  if (!conversation) notFound();

  const { id, name, image, isGroup, users } = conversation;

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col h-full">
        <ChatHeader
          conversationId={id}
          name={name}
          image={image}
          isGroup={isGroup}
          usersCount={users.length}
          members={users}
        />
        <MessagesList initialMessages={messages} conversationId={id} />
        <div className="max-w-[1000px] self-center w-full">
          <MessageForm conversationId={id} />
        </div>
      </div>
    </div>
  );
}
