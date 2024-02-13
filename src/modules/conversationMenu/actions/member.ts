"use server";

import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { ConversationEvent, DeleteMemberEvent } from "@/common/types";
import {
  ChangeRoleFields,
  DeleteMemberFields,
  changeRoleSchema,
  deleteMemberSchema,
} from "../validations/member";
import { canMutateConversation, getUserAuth } from "@/common/dataAccess";

export const changeMemberRole = async (data: ChangeRoleFields) => {
  const result = changeRoleSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const { userId } = await getUserAuth();
  const { role, memberId, conversationId } = result.data;

  try {
    if (!canMutateConversation(userId, conversationId)) {
      throw new Error(
        "You must be an admin of a conversation to delete member"
      );
    }

    const updatedMember = await db.member.update({
      where: {
        id: memberId,
      },
      data: {
        role,
      },
    });

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
    const message = (error as Error).message ?? "Failed to change member role";
    console.log(message);
    throw new Error(message);
  }
};

export const deleteMember = async (data: DeleteMemberFields) => {
  const result = deleteMemberSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const { userId } = await getUserAuth();
  const { conversationId, memberId } = result.data;

  try {
    if (!canMutateConversation(userId, conversationId)) {
      throw new Error(
        "You must be an admin of a conversation to change member role"
      );
    }

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
};
