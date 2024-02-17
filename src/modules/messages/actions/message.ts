"use server";

import {
  DeleteMessageFields,
  MarkAsSeenFields,
  deleteMessageSchema,
  markAsSeenSchema,
} from "../validations/message";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { canMutateMessage, getUserAuth } from "@/common/dataAccess";
import { getMessagesChannel } from "@/common/utils";
import { messageEvents } from "@/common/const";

export const deleteMessage = async (data: DeleteMessageFields) => {
  const result = deleteMessageSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const { userId } = await getUserAuth();
  const { conversationId, messageId } = result.data;

  try {
    const canMutate = await canMutateMessage({
      clerkId: userId,
      conversationId,
      messageId,
    });

    if (!canMutate) {
      throw new Error(
        "You must be admin, editor or the sender of the message in order to delete it",
      );
    }

    const deletedMessage = await db.message.delete({
      where: { id: messageId },
      select: {
        createdAt: true,
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
      const previousMessage = await db.message.findMany({
        take: 1,
        where: {
          createdAt: {
            lt: deletedMessage.createdAt,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      conversation = await db.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageId: previousMessage[0]?.id,
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
        const messagesChannel = getMessagesChannel({
          userId: member.user.clerkId,
        });

        pusherServer.trigger(messagesChannel, messageEvents.deleteMessage, {
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
};

export const markAsSeen = async (data: MarkAsSeenFields) => {
  const result = markAsSeenSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

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

    const messagesChannel = getMessagesChannel({
      userId: updatedMessage.user.clerkId,
    });

    pusherServer.trigger(messagesChannel, messageEvents.markAsSeen, {
      conversationId,
    });

    return { success: true, data: updatedMessage };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to mark as seen";
    console.log({ message });
    throw new Error(message);
  }
};
