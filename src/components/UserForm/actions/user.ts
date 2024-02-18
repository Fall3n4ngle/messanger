"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { UpsertUserFields, upsertUserSchema } from "../validations/user";
import { getUserAuth } from "@/common/dataAccess";

export const upsertUser = async (fields: UpsertUserFields) => {
  const parsed = upsertUserSchema.safeParse(fields);

  if (!parsed.success) {
    throw new Error(parsed.error.toString());
  }

  const {
    data: { id, name, ...data },
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
      ...data,
      clerkId,
    },
    update: data,
    where: { id: id ?? "" },
  });

  if (!id) {
    redirect("/");
  }

  revalidatePath("/");

  return { success: true, data: result };
};
