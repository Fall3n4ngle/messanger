"use server";

import { getUserAuth } from "@/common/dataAccess";
import { db } from "@/lib/db";

type Props = {
  conversationId: string;
};

export const getUserMember = async ({ conversationId }: Props) => {
  const { userId } = await getUserAuth();

  try {
    const member = await db.member.findFirst({
      where: {
        conversationId,
        user: {
          clerkId: userId,
        },
      },
      select: {
        id: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            clerkId: true,
            image: true,
          },
        },
      },
    });

    if (!member) {
      throw new Error("User member not found");
    }

    return member;
  } catch (error) {
    throw new Error("Failed to get your member");
  }
};

export type UserMember = NonNullable<Awaited<ReturnType<typeof getUserMember>>>;
