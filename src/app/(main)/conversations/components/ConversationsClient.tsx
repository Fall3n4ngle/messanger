"use client";

import { UserConversation } from "@/common/actions/conversation/queries";
import { cn } from "@/common/utils";
import { Search } from "@/components";
import { CreateConversationButton } from "@/modules/createConversation";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

export default function ConversationsClient({ children }: PropsWithChildren) {
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
      {children}
    </div>
  );
}
