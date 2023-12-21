"use server";

import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type Props = {
  id: string;
  role: MemberRole;
  conversationId: string;
};

export const changeMemberRole = async ({ id, role }: Props) => {
  try {
    const updatedMember = await db.member.update({
      where: { id },
      data: {
        role,
      },
    });

    revalidatePath(``);

    return { success: true, data: updatedMember };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to update member role";
    console.log(message);
    return { success: false, error: message };
  }
};
