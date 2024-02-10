import { getConversationById } from "./actions/conversation";
import { getUserMember } from "@/common/actions/member/queries";
import { getMessages } from "@/common/actions/messages/queries";
import { notFound } from "next/navigation";
import { Messages } from "@/modules/messages";
import { MessageForm } from "@/modules/messageForm";
import ConversationHeading from "./components/ConversationHeading";
import { MediaRoomButton } from "@/modules/mediaRoom";
import { ConversationMenuButton } from "@/modules/conversationMenu";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { ScrollArea } from "@/ui";

type Props = {
  params: {
    conversationId: string;
  };
};

export default async function Conversation({
  params: { conversationId },
}: Props) {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => getConversationById(conversationId),
  });

  await Promise.all([
    queryClient.fetchQuery({
      queryKey: ["messages", conversationId],
      queryFn: () => getMessages({ conversationId }),
    }),

    queryClient.fetchQuery({
      queryKey: ["member", conversationId],
      queryFn: () => getUserMember({ conversationId }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full h-full">
        <div className="flex flex-col h-full">
          <div className="p-3 md:px-6 border-b w-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Link
                  href="/conversations"
                  className="mt-1 min-[900px]:hidden"
                  aria-label="Back to conversations"
                >
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
          <ScrollArea className="flex-1 px-4 md:px-6 py-6 relative">
            <Messages />
          </ScrollArea>
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
