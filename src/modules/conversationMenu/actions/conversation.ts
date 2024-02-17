"use server";

import {
  EditConversationFields,
  editConversationSchema,
} from "../validations/conversation";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { ConversationEvent } from "@/common/types";
import { canMutateConversation, getUserAuth } from "@/common/dataAccess";
import { getConversationsChannel } from "@/common/utils";
import { conversationEvents } from "@/common/const";

export const editConversation = async (data: EditConversationFields) => {
  const result = editConversationSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const { userId } = await getUserAuth();
  const { id, ...fields } = result.data;

  try {
    const canMutate = await canMutateConversation(userId, id);

    if (!canMutate) {
      throw new Error(
        "You must be an admin of a conversation to edit conversation",
      );
    }

    const updatedGroup = await db.conversation.update({
      where: { id },
      data: fields,
      select: {
        id: true,
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

    const { members, ...conversation } = updatedGroup;

    members.forEach((member) => {
      if (member.user.clerkId !== userId) {
        const conversationChannel = getConversationsChannel({
          userId: member.user.clerkId,
        });

        pusherServer.trigger(
          conversationChannel,
          conversationEvents.updateConversation,
          {
            conversationId: conversation.id,
          } as ConversationEvent,
        );
      }
    });

    return { success: true, data: conversation };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to update group";
    console.log(message);
    throw new Error(message);
  }
};
