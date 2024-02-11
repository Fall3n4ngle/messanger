"use server";

import { checkAuth } from "@/common/dataAccess";
import { PaginationProps } from "@/common/types/pagination";
import { db } from "@/lib/db";

type Props = {
  conversationId: string;
} & PaginationProps;

export const getMessages = async ({
  conversationId,
  lastCursor,
  take,
}: Props) => {
  await checkAuth();
  const cursor = lastCursor ? { id: lastCursor } : undefined;

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
      take,
      cursor,
      skip: cursor ? 1 : 0,
    });

    return messages;
  } catch {
    throw new Error("Failed to get messages");
  }
};

export type Message = Awaited<ReturnType<typeof getMessages>>[number];
