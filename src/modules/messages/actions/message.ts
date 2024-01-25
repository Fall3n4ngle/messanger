"use server";

import { auth } from "@clerk/nextjs";
import {
  DeleteMessageFields,
  MarkAsSeenFields,
  deleteMessageSchema,
  markAsSeenSchema,
} from "../validations/message";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";

export const deleteMessage = async (data: DeleteMessageFields) => {
  const result = deleteMessageSchema.safeParse(data);

  if (result.success) {
    const { conversationId, messageId, previousMessageId } = result.data;

    try {
      const { userId } = auth();

      if (!userId) redirect("/sign-in");

      const deletedMessage = await db.message.delete({
        where: { id: messageId },
        select: {
          id: true,
          conversation: {
            select: {
              lastMessageId: true,
            },
          },
        },
      });

      const isLast = deletedMessage.conversation.lastMessageId === messageId;
      let conversation;

      if (isLast) {
        conversation = await db.conversation.update({
          where: { id: conversationId },
          data: {
            lastMessageId: previousMessageId,
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
      } else {
        conversation = await db.conversation.findFirst({
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
      }

      conversation?.members.forEach((member) => {
        if (member.user.clerkId !== userId) {
          const messagesChannel = `${member.user.clerkId}_messages`;

          pusherServer.trigger(messagesChannel, "messages:delete", {
            conversationId,
          });
        }
      });

      return { data: deletedMessage };
    } catch (error) {
      const message = (error as Error).message ?? "Failed to delete message";
      console.log({ message });
      throw new Error(message);
    }
  }

  if (result.error) {
    throw new Error(result.error.toString());
  }
};

export const markAsSeen = async (data: MarkAsSeenFields) => {
  const result = markAsSeenSchema.safeParse(data);

  if (result.success) {
    const { conversationId, userId, messageId } = result.data;

    try {
      const updatedMessage = await db.message.update({
        where: { id: messageId },
        data: {
          seenBy: {
            connect: {
              id: userId,
            },
          },
        },
        select: {
          user: {
            select: {
              clerkId: true,
            },
          },
        },
      });

      const messagesChannel = `${updatedMessage.user.clerkId}_messages`;

      pusherServer.trigger(messagesChannel, "messages:seen", {
        conversationId,
      });

      return { success: true, data: updatedMessage };
    } catch (error) {
      const message = (error as Error).message ?? "Failed to mark as seen";
      console.log({ message });
      throw new Error(message);
    }
  }

  if (result.error) {
    throw new Error(result.error.toString());
  }
};
