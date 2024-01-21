"use server";

import {
  sendMessageSchema,
  SendMessageFields,
  DeleteMessageFields,
  deleteMessageSchema,
  MarkAsSeenFields,
  markAsSeenSchema,
  UpdateMessageFields,
  updateMessageSchema,
} from "@/lib/validations";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { auth } from "@clerk/nextjs";

export type UpdateMessage = {
  id?: string;
  content: string | null;
  file: string | null;
};

export type SendConversationEvent = {
  conversationId: string;
};

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
          member: {
            select: {
              id: true,
              role: true,
              user: {
                select: {
                  image: true,
                  name: true,
                  clerkId: true,
                },
              },
            },
          },
          seenBy: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
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
          const conversationsChannel = `${member.user.clerkId}_conversations`;

          pusherServer.trigger(
            conversationsChannel,
            "conversation:new_message",
            {
              conversationId: createdMessage.conversationId,
            } as SendConversationEvent
          );
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

export const updateMessage = async (data: UpdateMessageFields) => {
  const result = updateMessageSchema.safeParse(data);

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

export const markAsSeen = async (data: MarkAsSeenFields) => {
  const result = markAsSeenSchema.safeParse(data);

  if (result.success) {
    const { conversationId, memberId, messageId } = result.data;

    try {
      const updatedMessage = await db.message.update({
        where: { id: messageId },
        data: {
          seenBy: {
            connect: {
              id: memberId,
            },
          },
        },
        select: {
          member: {
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

      const messagesChannel = `${updatedMessage.member.user.clerkId}_messages`;

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
