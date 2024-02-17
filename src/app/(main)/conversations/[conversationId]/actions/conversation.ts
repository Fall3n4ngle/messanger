"use server";

import { checkAuth } from "@/common/dataAccess";
import { db } from "@/lib/db";
import { cache } from "react";

export const getConversationById = cache(async (conversationId: string) => {
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

  return conversation;
});
