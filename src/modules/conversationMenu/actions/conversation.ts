"use server";

import { auth } from "@clerk/nextjs";
import {
  EditConversationFields,
  editConversationSchema,
} from "../validations/conversation";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { ConversationEvent } from "@/common/types/events";
import { revalidatePath } from "next/cache";

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

      revalidatePath(`/conversations/${id}`);

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
      throw new Error(message);
    }
  }

  if (result.error) {
    throw new Error(result.error.toString());
  }
};
