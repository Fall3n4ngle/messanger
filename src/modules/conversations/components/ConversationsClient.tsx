"use client";

import { useSearchParams } from "next/navigation";
import {
  usePusherConversations,
  usePusherMessages,
  useConversations,
} from "../hooks";
import ConversationsList from "./ConversationsList";
import { useToast } from "@/common/hooks";
import { ToastMessage } from "@/components";

export default function ConversationsClient() {
  const { toast } = useToast();
  const query = useSearchParams().get("query");

  const { data, error } = useConversations({
    query,
  });

  usePusherConversations();
  usePusherMessages();

  if (error) {
    toast({
      description: (
        <ToastMessage type="error" message="Failed to load conversations" />
      ),
    });

    return null;
  }

  if (!data?.length) {
    return <p className="pl-3">No conversations found</p>;
  }

  return <ConversationsList conversations={data} />;
}
