"use server";

import {
  EditMessageFields,
  SendMessageFields,
  editMessageSchema,
  sendMessageSchema,
} from "../validations/message";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { canMutateMessage, getUserAuth } from "@/common/dataAccess";
import { getMessagesChannel } from "@/common/utils";
import { messageEvents } from "@/common/const";

export const sendMessage = async (fields: SendMessageFields) => {
  const result = sendMessageSchema.safeParse(fields);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const { userId } = await getUserAuth();

  if (result.success) {
    try {
      const createdMessage = await db.message.create({
        data: result.data,
        select: {
          id: true,
          content: true,
          file: true,
          updatedAt: true,
          conversationId: true,
          user: {
            select: {
              image: true,
              name: true,
              clerkId: true,
            },
          },

          seenBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      const updatedConversation = await db.conversation.update({
        where: {
          id: createdMessage.conversationId,
        },
        data: {
          lastMessageId: createdMessage.id,
        },
        select: {
          members: {
            select: {
              id: true,
              user: {
                select: {
                  clerkId: true,
                },
              },
            },
          },
        },
      });

      updatedConversation.members.forEach((member) => {
        if (member.user.clerkId !== userId) {
          const messagesChannel = getMessagesChannel({
            userId: member.user.clerkId,
          });

          pusherServer.trigger(messagesChannel, messageEvents.newMessage, {
            conversationId: createdMessage.conversationId,
          });
        }
      });

      return { data: createdMessage };
    } catch (error) {
      const message = (error as Error).message ?? "Failed to send message";
      console.log({ message });
      throw new Error(message);
    }
  }
};

export const editMessage = async (data: EditMessageFields) => {
  const result = editMessageSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const { userId } = await getUserAuth();
  const { id, conversationId, ...fields } = result.data;

  try {
    const canMutate = await canMutateMessage({
      clerkId: userId,
      messageId: id,
      conversationId,
    });

    if (!canMutate) {
      throw new Error(
        "You must be admin, editor or the sender of the message in order to edit it",
      );
    }

    const updatedMessage = await db.message.update({
      where: { id },
      data: fields,
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

    if (!conversation) {
      throw new Error("conversation not found");
    }

    conversation.members.forEach((member) => {
      if (member.user.clerkId !== userId) {
        const messagesChannel = getMessagesChannel({
          userId: member.user.clerkId,
        });

        pusherServer.trigger(messagesChannel, messageEvents.updateMessage, {
          conversationId,
        });
      }
    });

    return { success: true, data: updatedMessage };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to update message";
    console.log({ message });
    throw new Error(message);
  }
};
