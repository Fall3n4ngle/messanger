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
import { Metadata } from "next";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

type Props = {
  params: {
    conversationId: string;
  };
};

export default async function Conversation({
  params: { conversationId },
}: Props) {
  const { userId: clerkId } = await getUserAuth();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => getConversationById(conversationId),
  });

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["messages", conversationId],
      queryFn: () => getMessages({ conversationId }),
    }),

    queryClient.prefetchQuery({
      queryKey: ["member", conversationId, clerkId],
      queryFn: () => getUserMember({ conversationId, clerkId }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)} >
      <div className="w-full h-screen">
        <div className="flex flex-col h-full">
          <div className="p-3 md:px-6 border-b w-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Link href="/conversations" className="mt-1 min-[900px]:hidden">
                  <ChevronLeft />
                </Link>
                <ConversationHeading />
              </div>
              <div className="flex items-center gap-1">
                <MediaRoomButton />
                <ConversationMenuButton />
              </div>
            </div>
          </div>
          <Messages />
          <div className="self-center w-full px-3 md:px-6 py-4 flex justify-center border-t">
            <MessageForm />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}

export const generateMetadata = async ({
  params: { conversationId },
}: Props) => {
  const conversation = await getConversationById(conversationId);
  if (!conversation) notFound();

  return {
    title: conversation.name,
  } as Metadata;
};
