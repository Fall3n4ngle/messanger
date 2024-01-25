"use server";

import { auth } from "@clerk/nextjs";
import {
  EditConversationFields,
  editConversationSchema,
} from "../validations/conversation";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { ConversationEvent } from "@/common/types/events";

export const editConversation = async (fields: EditConversationFields) => {
  const result = editConversationSchema.safeParse(fields);

  if (result.success) {
    const { id, ...fields } = result.data;

    try {
      const { userId } = auth();

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
          const conversationChannel = `${member.user.clerkId}_conversations`;

          pusherServer.trigger(conversationChannel, "conversation:update", {
            conversationId: conversation.id,
          } as ConversationEvent);
        }
      });

      return { success: true, data: conversation };
    } catch (error) {
      const message = (error as Error).message ?? "Failed to create group";
      console.log(message);
      return { success: false, error: message };
    }
  }

  if (result.error) {
    return { success: false, error: result.error.format() };
  }
};
