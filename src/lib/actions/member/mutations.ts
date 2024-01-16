"use server";

import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/lib/pusher/server";
import { DeleteMemberFields, deleteMemberSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs";

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

export type DeleteMemberEvent = {
  conversationId: string;
  userId: string;
  conversationName: string;
};

export const deleteMember = async (data: DeleteMemberFields) => {
  const result = deleteMemberSchema.safeParse(data);

  if (result.success) {
    const { conversationId, memberId } = result.data;

    try {
      const { userId } = auth();

      const conversation = await db.conversation.findFirst({
        where: {
          id: conversationId,
        },
        select: {
          name: true,
          members: {
            select: {
              userId: true,
            },
          },
        },
      });

      const deletedMember = await db.member.delete({
        where: {
          id: memberId,
        },
        select: {
          userId: true,
        },
      });

      conversation?.members.forEach((member) => {
        if (userId !== deletedMember.userId) {
          pusherServer.trigger(member.userId, "member:delete", {
            conversationId,
            userId: deletedMember.userId,
            conversationName: conversation.name,
          } as DeleteMemberEvent);
        }
      });

      return { success: true, data: deletedMember };
    } catch (error) {
      const message = (error as Error).message ?? "Failed to delete member";
      console.log(message);
      throw new Error(message);
    }
  }

  if (result.error) {
    throw new Error(result.error.toString());
  }
};
