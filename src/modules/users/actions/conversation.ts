"use server";

import { GetConversationsProps } from "@/common/actions/conversation/queries";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

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
