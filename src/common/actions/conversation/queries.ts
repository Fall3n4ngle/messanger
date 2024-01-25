"use server";

import { db } from "@/lib/db";

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

export type UserConversation = Awaited<
  ReturnType<typeof getUserConversations>
>[number];
