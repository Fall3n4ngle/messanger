"use server";

import { db } from "@/lib/db";

type Props = {
  conversationId: string;
  take?: number;
  lastCursor?: string;
};

export const getMessages = async ({
  conversationId,
  lastCursor,
  take,
}: Props) => {
  const cursor = lastCursor ? { id: lastCursor } : undefined;

  const messages = await db.message.findMany({
    where: {
      conversationId,
    },
    select: {
      id: true,
      content: true,
      file: true,
      updatedAt: true,
      member: {
        select: {
          user: {
            select: {
              image: true,
              name: true,
              clerkId: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    cursor,
    take,
    skip: cursor ? 1 : 0,
  });

  return messages;
};
