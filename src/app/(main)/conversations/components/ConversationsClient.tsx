"use client";

import { cn } from "@/common/utils";
import { CreateConversationDialog } from "@/modules/createConversation";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

export default function ConversationsClient({ children }: PropsWithChildren) {
  const isOnConversationPage = !!useParams()?.conversationId;

  return (
    <div
      className={cn(
        "w-full flex-col border-r md:max-w-[320px] min-[900px]:flex",
        isOnConversationPage ? "hidden" : "flex",
      )}
    >
      <div className="mx-auto flex w-full min-w-[270px] max-w-[450px] items-center gap-3 p-4 md:mx-0">
        <div className="grow">
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Conversations
          </h4>
        </div>
        <CreateConversationDialog />
      </div>
      {children}
    </div>
  );
}
