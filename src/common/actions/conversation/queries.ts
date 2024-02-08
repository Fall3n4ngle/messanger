"use server";

import { checkAuth, getUserAuth } from "@/common/dataAccess";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { cache } from "react";

export type GetConversationsProps = {
  query?: string;
};

export const getUserConversations = async ({
  query = "",
}: GetConversationsProps) => {
  const { userId: clerkId } = await getUserAuth();

  try {
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
  } catch {
    throw new Error("Failed to get your conversations");
  }
};

export type UserConversation = Awaited<
  ReturnType<typeof getUserConversations>
>[number];

export const getConversationById = cache(async (conversationId: string) => {
  console.log("getConversationById");
  await checkAuth();

  const conversation = await db.conversation.findFirst({
    where: { id: conversationId },
    select: {
      id: true,
      name: true,
      image: true,
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

  if (!conversation) notFound();

  return conversation;
});