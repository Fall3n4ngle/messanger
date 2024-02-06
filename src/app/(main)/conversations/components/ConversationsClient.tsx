"use client";

import { UserConversation } from "@/common/actions/conversation/queries";
import { cn } from "@/common/utils";
import { Search } from "@/components";
import { Conversations } from "@/modules/conversations";
import { CreateConversationButton } from "@/modules/createConversation";
import { ScrollArea } from "@/ui";
import { useParams } from "next/navigation";

type Props = {
  initialConversations: UserConversation[];
};

export default function ConversationsClient({ initialConversations }: Props) {
  const isOnConversationPage = !!useParams()?.conversationId;

  return (
    <div
      className={cn(
        "border-r md:max-w-[320px] w-full min-[900px]:flex flex-col",
        isOnConversationPage ? "hidden" : "flex"
      )}
    >
      <div className="flex items-center gap-3 p-4 min-w-[270px] max-w-[450px] w-full mx-auto md:mx-0">
        <div className="grow">
          <Search label="Search conversations" id="searchConversations" />
        </div>
        <CreateConversationButton />
      </div>
      <ScrollArea className="max-w-[450px] w-full mx-auto md:mx-0 pb-10 sm:pb-0">
        <Conversations intialConversations={initialConversations} />
      </ScrollArea>
    </div>
  );
}
