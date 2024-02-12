"use client";

import { useMessages } from "../hooks/useMessages";
import MessagesList from "./MessagesList";
import { useMember } from "@/common/hooks";
import { useParams } from "next/navigation";

export default function Messages() {
  const conversationId = useParams().conversationId as string;

  const { data: messages, dataUpdatedAt } = useMessages({
    conversationId,
  });

  const { data: member } = useMember({
    conversationId,
  });

  if (!messages?.length) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          No messages yet
        </h3>
      </div>
    );
  }

  return (
    <MessagesList
      currentUserId={member?.user.id ?? ""}
      memberRole={member?.role ?? "VIEW"}
      messages={messages}
      dataUpdatedAt={dataUpdatedAt}
    />
  );
}
