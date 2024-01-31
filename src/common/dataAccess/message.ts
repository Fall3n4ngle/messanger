import "server-only";

import { db } from "@/lib/db";

type Props = {
  messageId: string;
  conversationId: string;
  clerkId: string;
};

export const canMutateMessage = async ({
  clerkId,
  messageId,
  conversationId,
}: Props) => {
  const message = await db.message.findFirst({
    where: {
      id: messageId,
    },
    select: {
      user: {
        select: {
          clerkId: true,
        },
      },
    },
  });

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.user.clerkId === clerkId) {
    return true;
  }

  const member = await db.member.findFirst({
    where: {
      conversationId,
      user: {
        clerkId,
      },
    },
  });

  if (!member) {
    throw new Error("Member not found");
  }

  const { role } = member;
  if (role === "ADMIN" || role === "EDIT") {
    return true;
  }

  return false;
};
