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
      members: {
        some: {
          userId: currentUserId,
        },
      },
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      updatedAt: true,
      isGroup: true,
      lastMessage: {
        select: {
          id: true,
          content: true,
          updatedAt: true,
          file: true,
          member: {
            select: {
              user: {
                select: {
                  clerkId: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      lastMessage: {
        updatedAt: "desc",
      },
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
};
