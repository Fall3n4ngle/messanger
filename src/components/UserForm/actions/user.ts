"use server";

import { UserFields, userSchema } from "@/common/validations";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const upsertUser = async (fields: UserFields) => {
  const parsed = userSchema.safeParse(fields);

  if (parsed.success) {
    const {
      data: { id, name, ...data },
    } = parsed;

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
      },
      update: data,
      where: { id: id ?? "" },
    });

    if (!id) {
      redirect("/");
    }

    revalidatePath("/");

    return { success: true, data: result };
  }

  if (parsed.error) {
    throw new Error(parsed.error.toString());
  }
};
