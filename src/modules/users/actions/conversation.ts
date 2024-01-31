"use server";

import { db } from "@/lib/db";
import { getUserAuth } from "@/common/dataAccess";
import { GetConversationsProps } from "../types";

export const getConversationsForSelect = async ({
  userId,
  query,
}: GetConversationsProps) => {
  const { userId: currentUserClerkId } = await getUserAuth();

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
