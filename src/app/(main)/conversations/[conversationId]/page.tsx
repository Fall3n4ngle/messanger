import {
  MessageForm,
  MessagesList,
  ConversationHeading,
  MediaRoomButton,
  ConversationMenuButton,
} from "@/components/chat";
import { getConversationById } from "@/lib/actions/conversation/queries";
import { getUserMember } from "@/lib/actions/member/queries";
import { getMessages } from "@/lib/actions/messages/queries";
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
  const { userId: clerkId } = auth();

  if (!clerkId) redirect("/sign-in");

  const conversationPromise = getConversationById(conversationId);
  const messagesPromise = getMessages({ conversationId, take: -25 });
  const userMemberPromise = getUserMember({ conversationId, clerkId });

  const [conversation, messages, userMember] = await Promise.all([
    conversationPromise,
    messagesPromise,
    userMemberPromise,
  ]);

  if (!conversation) notFound();
  if (!userMember) redirect("/onboarding");

  const { id, name, image, isGroup, members } = conversation;

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
              <ConversationMenuButton
                memberRole={userMember.role}
                isGroup={isGroup}
                members={members}
                conversationId={conversationId}
                userMemberId={userMember.id}
                name={name}
                image={image}
              />
            </div>
          </div>
        </div>
        <MessagesList
          initialMessages={messages}
          conversationId={id}
          memberRole={userMember.role}
          currentUserId={userMember.user.id}
        />
        <div className="max-w-[1000px] self-center w-full">
          <MessageForm conversationId={id} user={userMember.user} />
        </div>
      </div>
    </div>
  );
}
