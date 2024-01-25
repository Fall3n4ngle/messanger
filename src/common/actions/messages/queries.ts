"use server";

import { db } from "@/lib/db";

type Props = {
  conversationId: string;
  take?: number;
  lastCursor?: string;
};

export const getMessages = async ({ conversationId }: Props) => {
  const messages = await db.message.findMany({
    where: {
      conversationId,
    },
    select: {
      id: true,
      content: true,
      file: true,
      updatedAt: true,
      conversationId: true,
      user: {
        select: {
          id: true,
          image: true,
          name: true,
          clerkId: true,
        },
      },
      seenBy: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return messages;
};

export type Message = Awaited<ReturnType<typeof getMessages>>[number];
