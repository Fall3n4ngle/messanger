"use server";

import { getUserAuth } from "@/common/dataAccess";
import { db } from "@/lib/db";

export const getUserByClerkId = async (clerkId: string) => {
  try {
    const user = await db.user.findFirst({
      where: { clerkId },
      select: { clerkId: true, name: true, image: true, id: true },
    });

    return user;
  } catch {
    throw new Error("Failed to get your user");
  }
};

type Props = {
  query: string | null;
  take?: number;
  lastCursor?: string;
};

export const getUsers = async ({
  query = "",
  lastCursor,
  take = 25,
}: Props) => {
  const { userId } = await getUserAuth();
  const cursor = lastCursor ? { id: lastCursor } : undefined;

  try {
    const users = await db.user.findMany({
      where: {
        NOT: {
          clerkId: userId,
        },
        name: {
          contains: query ?? "",
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
  } catch (error) {
    throw new Error("Failed to get users");
  }
};

export type User = Awaited<ReturnType<typeof getUsers>>[number];
