import "server-only";

import { db } from "@/lib/db";

export const canMutateConversation = async (
  clerkId: string,
  conversationId: string,
) => {
  const member = await db.member.findFirst({
    where: {
      user: {
        clerkId,
      },
      conversationId,
    },
    select: {
      role: true,
    },
  });

  if (!member || member.role !== "ADMIN") {
    return false;
  }

  return true;
};
