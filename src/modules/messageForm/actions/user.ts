"use server";

import { pusherServer } from "@/lib/pusher/server";
import { getUserAuth } from "@/common/dataAccess";

type Props = {
  userName: string;
  conversationId: string;
};

export const addTypingUser = async ({ conversationId, userName }: Props) => {
  const { userId } = await getUserAuth();

  pusherServer.trigger(conversationId, "user:start_typing", {
    userName,
    clerkId: userId,
  });
};

export const removeTypingUser = async ({ conversationId, userName }: Props) => {
  pusherServer.trigger(conversationId, "user:stop_typing", {
    userName,
  });
};
