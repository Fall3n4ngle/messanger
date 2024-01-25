"use server";

import { auth } from "@clerk/nextjs";
import {
  EditMessageFields,
  SendMessageFields,
  editMessageSchema,
  sendMessageSchema,
} from "../validations/message";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";

export const sendMessage = async (fields: SendMessageFields) => {
  const result = sendMessageSchema.safeParse(fields);

  if (result.success) {
    try {
      const { userId } = auth();

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
          const conversationsChannel = `${member.user.clerkId}_messages`;

          pusherServer.trigger(conversationsChannel, "messages:new", {
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

  if (result.error) {
    throw new Error(result.error.toString());
  }
};

export const editMessage = async (data: EditMessageFields) => {
  const result = editMessageSchema.safeParse(data);

  if (result.success) {
    const { id, conversationId, ...data } = result.data;

    try {
      const { userId } = auth();

      const updatedMessage = await db.message.update({
        where: { id },
        data,
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
          const messagesChannel = `${member.user.clerkId}_messages`;

          pusherServer.trigger(messagesChannel, "messages:update", {
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
  }

  if (result.error) {
    throw new Error(result.error.toString());
  }
};
