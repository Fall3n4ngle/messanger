"use server";

import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { ConversationEvent, DeleteMemberEvent } from "@/common/types/events";
import {
  ChangeRoleFields,
  DeleteMemberFields,
  changeRoleSchema,
  deleteMemberSchema,
} from "../validations/member";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export const changeMemberRole = async (data: ChangeRoleFields) => {
  const result = changeRoleSchema.safeParse(data);

  if (result.success) {
    const { role, memberId, conversationId } = result.data;

    try {
      const { userId } = auth();

      const updatedMember = await db.member.update({
        where: {
          id: memberId,
        },
        data: {
          role,
        },
      });

      revalidatePath(`/conversations/${conversationId}`);

      const conversation = await db.conversation.findFirst({
        where: { id: conversationId },
        select: {
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

      conversation?.members.forEach((member) => {
        if (member.user.clerkId !== userId) {
          const conversationsChannel = `${member.user.clerkId}_conversations`;

          pusherServer.trigger(
            conversationsChannel,
            "conversation:update_member",
            {
              conversationId,
            } as ConversationEvent
          );
        }
      });

      return { success: true, data: updatedMember };
    } catch (error) {
      const message =
        (error as Error).message ?? "Failed to change member role";
      console.log(message);
      throw new Error(message);
    }
  }

  if (result.error) {
    throw new Error(result.error.toString());
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

      revalidatePath(`/conversations/${conversationId}`);

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
