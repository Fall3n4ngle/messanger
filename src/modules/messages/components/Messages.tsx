"use client";

import { MemberRole } from "@prisma/client";
import { Message } from "@/common/actions/messages/queries";
import { useMessages } from "../hooks/useMessages";
import MessagesList from "./MessagesList";
import { useToast } from "@/common/hooks";
import { ToastMessage } from "@/components";

type Props = {
  initialMessages: Message[];
  conversationId: string;
  memberRole: MemberRole;
  currentUserId: string;
};

export default function Messages({
  conversationId,
  initialMessages,
  memberRole,
  currentUserId,
}: Props) {
  const { toast } = useToast();

  const {
    data: messages,
    dataUpdatedAt,
    error,
  } = useMessages({
    conversationId,
    initialMessages,
  });

  if (error) {
    toast({
      description: (
        <ToastMessage type="error" message="Failed to get messages" />
      ),
    });

    return null;
  }

  if (messages.length < 1) {
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
      currentUserId={currentUserId}
      memberRole={memberRole}
      messages={messages}
      dataUpdatedAt={dataUpdatedAt}
    />
  );
}
