import { MessageForm, ChatHeader, MessagesList } from "@/components/chat";
import { ScrollArea } from "@/components/ui";
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
        <ScrollArea className="flex-1 relative">
          <MessagesList initialMessages={messages} conversationId={id} />
        </ScrollArea>
        <div className="max-w-[1000px] self-center w-full">
          <MessageForm conversationId={id} />
        </div>
      </div>
    </div>
  );
}