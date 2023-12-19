import { MessageForm, ChatHeader, MessagesList } from "@/components/chat";
import { getConversationById } from "@/lib/actions/conversation/queries";
import { getMessages } from "@/lib/actions/messages/queries";
import { getUserByClerkId } from "@/lib/actions/user/queries";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: {
    conversationId: string;
  };
};

export default async function Conversation({
  params: { conversationId },
}: Props) {
  const { userId } = auth();

  if (!userId) redirect("/sign-in")

  const conversationPromise = getConversationById(conversationId);
  const messagesPromise = getMessages({ conversationId, take: -25 });
  const userPromise = getUserByClerkId(userId);

  const [conversation, messages, user] = await Promise.all([
    conversationPromise,
    messagesPromise,
    userPromise,
  ]);

  if (!conversation) notFound();
  if (!user) redirect("/onboarding");

  const { id, name, image, isGroup, members } = conversation;

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col h-full">
        <ChatHeader
          conversationId={id}
          name={name}
          image={image}
          isGroup={isGroup}
          usersCount={members.length}
          members={members}
        />
        <MessagesList initialMessages={messages} conversationId={id} />
        <div className="max-w-[1000px] self-center w-full">
          <MessageForm conversationId={id} userName={user.name} />
        </div>
      </div>
    </div>
  );
}
