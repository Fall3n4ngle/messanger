"use server";

import { redirect } from "next/navigation";
import { pusherServer } from "../../pusher/server";
import { auth } from "@clerk/nextjs";

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
