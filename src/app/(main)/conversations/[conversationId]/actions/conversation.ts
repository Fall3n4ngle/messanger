"use server";

import { checkAuth } from "@/common/dataAccess";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { cache } from "react";

export const getConversationById = cache(async (conversationId: string) => {
  console.log("getConversationById");
  await checkAuth();

  const conversation = await db.conversation.findFirst({
    where: { id: conversationId },
    select: {
      id: true,
      name: true,
      image: true,
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              clerkId: true,
            },
          },
        },
      },
    },
  });

  if (!conversation) notFound();

  return conversation;
});
