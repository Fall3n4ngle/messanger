import { getConversationById } from "./actions/conversation";
import { getUserMember } from "@/common/actions/member/queries";
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
import { conversationKeys, memberKeys } from "@/common/const";
import { Suspense } from "react";
import { Loader } from "@/components";

type Props = {
  params: {
    conversationId: string;
  };
};

export default async function Conversation({
  params: { conversationId },
}: Props) {
  const queryClient = new QueryClient();

  const conversation = await queryClient.fetchQuery({
    queryKey: conversationKeys.detail(conversationId),
    queryFn: () => getConversationById(conversationId),
  });

  if (!conversation) notFound();

  await queryClient.fetchQuery({
    queryKey: memberKeys.detail(conversationId),
    queryFn: () => getUserMember({ conversationId }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="h-full w-full">
        <div className="flex h-full flex-col">
          <div className="w-full border-b p-3 md:px-6">
            <div className="flex items-center justify-between">
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
          <Suspense fallback={<Loader />}>
            <Messages conversationId={conversationId} />
          </Suspense>
          <div className="flex w-full justify-center self-center border-t px-3 py-4 md:px-6">
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
