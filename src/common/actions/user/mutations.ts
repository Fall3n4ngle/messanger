"use server";

import { UserFields, userSchema } from "@/common/validations";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const upsertUser = async (fields: UserFields) => {
  const parsed = userSchema.safeParse(fields);

  if (parsed.success) {
    const {
      data: { id, ...data },
    } = parsed;
    try {
      const result = await db.user.upsert({
        create: data,
        update: data,
        where: { id: id ?? "" },
      });

      if (!id) {
        redirect("/");
      }

      revalidatePath("/");

      return { success: true, data: result };
    } catch (error) {
      const message = (error as Error).message ?? "Failed to upsert user";
      console.log(message);
      throw new Error(message);
    }
  }

  if (parsed.error) {
    throw new Error(parsed.error.toString());
  }
};
