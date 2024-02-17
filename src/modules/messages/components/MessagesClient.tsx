"use client";

import { useMessages } from "../hooks/useMessages";
import MessagesList from "./MessagesList";
import { useMember } from "@/common/hooks";
import { useParams } from "next/navigation";

export default function MessagesClient() {
  const conversationId = useParams().conversationId as string;

  const { data: messages, dataUpdatedAt } = useMessages({
    conversationId,
  });

  const { data: member } = useMember({
    conversationId,
  });

  if (!member) return null;

  if (!messages?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          No messages yet
        </h3>
      </div>
    );
  }

  return (
    <MessagesList
      currentUserId={member.user.id}
      memberRole={member.role}
      messages={messages}
      dataUpdatedAt={dataUpdatedAt}
    />
  );
}
