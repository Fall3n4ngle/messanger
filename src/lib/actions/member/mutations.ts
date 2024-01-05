"use server";

import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ChangeMemberRoleProps = {
  id: string;
  role: MemberRole;
  conversationId: string;
};

export const changeMemberRole = async ({
  id,
  role,
  conversationId,
}: ChangeMemberRoleProps) => {
  try {
    const updatedMember = await db.member.update({
      where: { id },
      data: {
        role,
      },
    });

    revalidatePath(`/conversations/${conversationId}`);

    return { success: true, data: updatedMember };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to update member role";
    console.log(message);
    return { success: false, error: message };
  }
};

type DeleteMemberProps = {
  memberId: string;
  conversationId: string;
};

export const deleteMember = async ({
  memberId,
  conversationId,
}: DeleteMemberProps) => {
  try {
    const deletedMember = await db.member.delete({
      where: {
        id: memberId,
      },
    });

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
      },
      select: {
        members: {
          select: {
            _count: true,
          },
        },
      },
    });

    if (conversation?.members.length === 0) {
      await db.conversation.delete({
        where: {
          id: conversationId,
        },
      });
    }

    return { success: true, data: deletedMember };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to delete member";
    console.log(message);
    return { success: false, error: message };
  }
};
