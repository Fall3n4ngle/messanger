"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { UpsertUserFields, upsertUserSchema } from "../validations/user";
import { getUserAuth } from "@/common/dataAccess";

export const upsertUser = async (fields: UpsertUserFields) => {
  const parsed = upsertUserSchema.safeParse(fields);

  if (!parsed.success) {
    throw new Error(parsed.error.toString());
  }

  const {
    data: { name, image },
  } = parsed;

  const { userId: clerkId } = await getUserAuth();

  const existingUser = await db.user.findFirst({
    where: {
      name: {
        equals: name,
      },
    },
  });

  if (existingUser) {
    throw new Error("Username is already taken. Choose another one");
  }

  const result = await db.user.upsert({
    create: {
      name,
      image,
      clerkId,
    },
    update: {
      name,
      image,
    },
    where: { clerkId },
  });

  revalidatePath("/");

  return { success: true, data: result };
};
