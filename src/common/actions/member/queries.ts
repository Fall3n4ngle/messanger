import { checkAuth } from "@/common/dataAccess";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  conversationId: string;
  clerkId: string;
};

export const getUserMember = async ({ conversationId, clerkId }: Props) => {
  await checkAuth();

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
          image: true,
          clerkId: true,
        },
      },
    },
  });

  if (!member) {
    redirect("/onboarding");
  }

  return member;
};

export type UserMember = NonNullable<Awaited<ReturnType<typeof getUserMember>>>;
