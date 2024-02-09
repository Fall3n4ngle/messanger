"use client";

import { useMessages } from "../hooks/useMessages";
import MessagesList from "./MessagesList";
import { useMember, useToast } from "@/common/hooks";
import { ToastMessage } from "@/components";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function Messages() {
  const { toast } = useToast();
  const conversationId = useParams().conversationId as string;

  const {
    data: messages,
    dataUpdatedAt,
    error,
  } = useMessages({
    conversationId,
  });

  const { data: member } = useMember({
    conversationId,
  });

  if (error) {
    toast({
      description: (
        <ToastMessage type="error" message="Failed to get messages" />
      ),
    });

    return null;
  }

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
