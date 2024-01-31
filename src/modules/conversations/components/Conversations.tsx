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
import { UserConversation } from "@/common/actions/conversation/queries";

type Props = {
  intialConversations: UserConversation[];
};

export default function Conversations({ intialConversations }: Props) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const { data, error } = useConversations({
    query,
    intialConversations,
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

  if (!data.length) {
    return <p className="pl-3">No conversations found</p>;
  }

  return <ConversationsList conversations={data} />;
}
