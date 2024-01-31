"use server";

import { getUserAuth } from "@/common/dataAccess";
import { db } from "@/lib/db";

export type GetConversationsProps = {
  query?: string;
};

export const getUserConversations = async ({
  query = "",
}: GetConversationsProps) => {
  const { userId: clerkId } = await getUserAuth();

  const convsersations = await db.conversation.findMany({
    where: {
      members: {
        some: {
          user: {
            clerkId,
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
      updatedAt: true,
      isGroup: true,
      messages: {
        where: {
          AND: {
            seenBy: {
              none: {
                clerkId,
              },
            },
            user: {
              clerkId: {
                not: clerkId,
              },
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
