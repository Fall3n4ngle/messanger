"use server";

import { db } from "@/lib/db";

type Props = {
  currentUserId: string;
  query?: string;
  take?: number;
  lastCursor?: Date;
};

export const getUserConversations = async ({
  currentUserId,
  lastCursor,
  query = "",
  take,
}: Props) => {
  const cursor = lastCursor ? { createdAt: lastCursor } : undefined;

  const convsersations = await db.conversation.findMany({
    where: {
      users: {
        some: {
          id: currentUserId,
        },
      },
      name: {
        contains: query,
        mode: "insensitive"
      }
    },
    orderBy: {
      lastMessageAt: "desc",
    },
    cursor,
    take,
    skip: cursor ? 1 : 0,
  });

  return convsersations;
};

export const getConversationById = async (conversationId: string) => {
  const conversation = await db.conversation.findFirst({
    where: { id: conversationId },
    select: {
      id: true,
      name: true,
      image: true,
      isGroup: true,
      creatorId: true,
      users: true,
    },
  });

  return conversation;
};
