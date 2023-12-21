import { db } from "@/lib/db";

type Props = {
  conversationId: string;
  clerkId: string;
};

export const getUserMember = async ({ conversationId, clerkId }: Props) => {
  const member = await db.member.findFirst({
    where: {
      conversationId,
      user: {
        clerkId,
      },
    },
    select: {
      id: true,
      role: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return member;
};
