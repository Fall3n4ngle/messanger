"use server";

import { db } from "@/lib/db";

type Props = {
  currentUserId: string;
  query?: string;
};

export const getUserConversations = async ({
  currentUserId,
  query = "",
}: Props) => {
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
      messages: {
        where: {
          AND: {
            seenBy: {
              none: {
                userId: currentUserId,
              },
            },
            member: {
              userId: {
                not: currentUserId,
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
