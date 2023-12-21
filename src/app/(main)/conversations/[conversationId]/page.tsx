import { MessageForm, MessagesList } from "@/components/chat";
import {
  ChatSheetButton,
  ConversationHeading,
  MediaRoomButton,
} from "@/components/chat/header";
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

  if (!userId) redirect("/sign-in");

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

  const {
    id,
    name,
    image,
    isGroup,
    members,
    userId: conversationAdminId,
  } = conversation;

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col h-full">
        <div className="py-3 px-6 border-b w-full">
          <div className="flex justify-between items-center">
            <ConversationHeading
              name={name}
              image={image}
              membersCount={members.length}
              conversationId={conversationId}
            />
            <div className="flex items-center gap-1">
              <MediaRoomButton conversationId={conversationId} />
              <ChatSheetButton
                members={members}
                name={name}
                conversationId={conversationId}
                currentUserId={user.id}
                conversationAdminId={conversationAdminId}
              />
            </div>
          </div>
        </div>
        <MessagesList initialMessages={messages} conversationId={id} />
        <div className="max-w-[1000px] self-center w-full">
          <MessageForm conversationId={id} userName={user.name} />
        </div>
      </div>
    </div>
  );
}
