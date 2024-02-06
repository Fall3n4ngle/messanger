import { getConversationById } from "./actions/conversation";
import { getUserMember } from "@/common/actions/member/queries";
import { getMessages } from "@/common/actions/messages/queries";
import { notFound } from "next/navigation";
import { Messages } from "@/modules/messages";
import { MessageForm } from "@/modules/messageForm";
import ConversationHeading from "./components/ConversationHeading";
import { MediaRoomButton } from "@/modules/mediaRoom";
import { ConversationMenuButton } from "@/modules/conversationMenu";
import { getUserAuth } from "@/common/dataAccess";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  params: {
    conversationId: string;
  };
};

export default async function Conversation({
  params: { conversationId },
}: Props) {
  const { userId: clerkId } = await getUserAuth();

  const conversation = await getConversationById(conversationId);
  if (!conversation) notFound();

  const [messages, userMember] = await Promise.all([
    getMessages({ conversationId }),
    getUserMember({ conversationId, clerkId }),
  ]);

  const { id, name, image, members } = conversation;

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col h-full">
        <div className="p-3 md:px-6 border-b w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link href="/conversations" className="mt-1 min-[900px]:hidden">
                <ChevronLeft />
              </Link>
              <ConversationHeading
                name={name}
                image={image}
                membersCount={members.length}
                conversationId={conversationId}
              />
            </div>
            <div className="flex items-center gap-1">
              <MediaRoomButton conversationId={conversationId} />
              <ConversationMenuButton
                memberRole={userMember.role}
                members={members}
                conversationId={conversationId}
                userMemberId={userMember.id}
                name={name}
                image={image}
              />
            </div>
          </div>
        </div>
        <Messages
          initialMessages={messages}
          conversationId={id}
          memberRole={userMember.role}
          currentUserId={userMember.user.id}
        />
        <div className="self-center w-full px-3 md:px-6 py-4 flex justify-center border-t">
          <MessageForm conversationId={id} user={userMember.user} />
        </div>
      </div>
    </div>
  );
}
