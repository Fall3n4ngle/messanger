"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export type GetConversationsProps = {
  userId: string;
  query?: string;
};

export const getUserConversations = async ({
  userId,
  query = "",
}: GetConversationsProps) => {
  const convsersations = await db.conversation.findMany({
    where: {
      members: {
        some: {
          userId,
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
      messages: {
        where: {
          AND: {
            seenBy: {
              none: {
                id: userId,
              },
            },
            userId: {
              not: userId,
            },
          },
        },
        select: {
          id: true,
        },
      },
      lastMessage: {
        select: {
          id: true,
          content: true,
          updatedAt: true,
          file: true,
          user: {
            select: {
              clerkId: true,
              name: true,
            },
          },
          _count: {
            select: {
              seenBy: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
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

export const getConversationsForSelect = async ({
  userId,
  query,
}: GetConversationsProps) => {
  const { userId: currentUserClerkId } = auth();

  if (!currentUserClerkId) {
    return [];
  }

  const conversations = await db.conversation.findMany({
    where: {
      members: {
        none: {
          user: {
            id: userId,
          },
        },
        some: {
          role: "ADMIN",
          user: {
            clerkId: currentUserClerkId,
          },
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
    },
    take: 10,
  });

  return conversations;
};
