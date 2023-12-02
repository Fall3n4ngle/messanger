"use server";

import { UserFields, userSchema } from "@/lib/validations";
import { db } from "@/lib/db"

export const upsertUser = async (fields: UserFields) => {
  const parsed = userSchema.safeParse(fields);

  if (parsed.success) {
    const {
      data
    } = parsed;
    try {
      const result = await db?.user.upsert({
        create: data,
        update: data,
        where: { clerkId: data.clerkId },
      });

      return { success: true, data: result };
    } catch (error) {
      const message = (error as Error).message ?? "Failed to upsert user";
      console.log(message);
      return { success: false, error: message };
    }
  }

  if (parsed.error) {
    return { success: false, error: parsed.error.format() };
  }
};
