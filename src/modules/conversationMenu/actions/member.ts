"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { MemberRole } from "@prisma/client";
import { pusherServer } from "@/lib/pusher/server";
import { DeleteMemberEvent } from "@/common/types/events";
import { DeleteMemberFields, deleteMemberSchema } from "../validations/member";
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
    const message = (error as Error).message ?? "Failed to change member role";
    console.log(message);
    return { success: false, error: message };
  }
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
              user: {
                select: {
                  clerkId: true,
                },
              },
            },
          },
        },
      });

      const deletedMember = await db.member.delete({
        where: {
          id: memberId,
        },
        select: {
          user: {
            select: {
              clerkId: true,
            },
          },
        },
      });

      conversation?.members.forEach((member) => {
        if (userId !== deletedMember.user.clerkId) {
          const conversationsChannel = `${member.user.clerkId}_conversations`;

          pusherServer.trigger(
            conversationsChannel,
            "conversation:delete_member",
            {
              conversationId,
              userId: deletedMember.user.clerkId,
              conversationName: conversation.name,
            } as DeleteMemberEvent
          );
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