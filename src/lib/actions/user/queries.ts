import { db } from "@/lib/db";

export const getUserByClerkId = async (clerkId: string) => {
  const user = await db.user.findFirst({
    where: { clerkId },
    select: { clerkId: true, name: true, image: true, id: true },
  });

  return user;
};

type Props = {
  query?: string;
  currentUserClerkId: string;
};

export const getUsers = async ({ currentUserClerkId, query = "" }: Props) => {
  const users = await db.user.findMany({
    where: {
      NOT: {
        clerkId: currentUserClerkId,
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
  });

  return users;
};
