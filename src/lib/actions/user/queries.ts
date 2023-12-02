import { db } from "@/lib/db";

export const getUserByClerkId = async (clerkId: string) => {
  const user = await db.user.findFirst({
    where: { clerkId },
    select: { clerkId: true, name: true, image: true },
  });

  return user;
};
