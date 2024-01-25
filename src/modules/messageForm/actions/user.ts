"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { pusherServer } from "@/lib/pusher/server";

type Props = {
  userName: string;
  conversationId: string;
};

export type TypingUser = {
  userName: string;
  clerkId: string;
};

export const addTypingUser = async ({ conversationId, userName }: Props) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

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
