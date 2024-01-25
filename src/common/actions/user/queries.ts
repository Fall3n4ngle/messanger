"use server";

import { db } from "@/lib/db";

export const getUserByClerkId = async (clerkId: string) => {
  const user = await db.user.findFirst({
    where: { clerkId },
    select: { clerkId: true, name: true, image: true, id: true },
  });

  return user;
};

type Props = {
  currentUserClerkId: string;
  query?: string;
  take?: number;
  lastCursor?: string;
};

export const getUsers = async ({
  currentUserClerkId,
  query = "",
  lastCursor,
  take = 25,
}: Props) => {
  const cursor = lastCursor ? { id: lastCursor } : undefined;

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
      clerkId: true,
    },
    cursor,
    take,
    orderBy: {
      name: "asc",
    },
    skip: cursor ? 1 : 0,
  });

  return users;
};

export type User = Awaited<ReturnType<typeof getUsers>>[number];