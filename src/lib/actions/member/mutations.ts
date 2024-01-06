"use server";

import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/lib/pusher/server";

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

export type DeleteMemberEvent = {
  conversationId: string;
  userId: string;
};

export const deleteMember = async ({
  memberId,
  conversationId,
}: DeleteMemberProps) => {
  try {
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
      },
      select: {
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
      pusherServer.trigger(member.userId, "member:delete", {
        conversationId,
        userId: deletedMember.userId,
      } as DeleteMemberEvent);
    });

    return { success: true, data: deletedMember };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to delete member";
    console.log(message);
    return { success: false, error: message };
  }
};
