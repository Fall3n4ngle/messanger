"use server";

import { checkAuth } from "@/common/dataAccess";
import { db } from "@/lib/db";

type Props = {
  conversationId: string;
};

export const getMessages = async ({ conversationId }: Props) => {
  await checkAuth();

  try {
    const messages = await db.message.findMany({
      where: {
        conversationId,
      },
      select: {
        id: true,
        content: true,
        file: true,
        updatedAt: true,
        createdAt: true,
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
  } catch {
    throw new Error("Failed to get messages");
  }
};

export type Message = Awaited<ReturnType<typeof getMessages>>[number];
