"use server";

import { MessageFields, sendMessageSchema } from "@/lib/validations";
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
}

export const sendMessage = async (fields: MessageFields) => {
  const result = sendMessageSchema.parse(fields);
  const { userId } = auth();

  const createdMessage = await db.message.create({
    data: result,
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

      pusherServer.trigger(conversationsChannel, "conversation:new_message", {
        conversationId: createdMessage.conversationId,
      } as SendConversationEvent);
    }
  });

  return { data: createdMessage };
};

type Props = {
  messageId: string;
  conversationId: string;
  previousMessageId: string | null;
};

export type DeleteMessage = {
  messageId: string;
  clerkId: string;
};

export const deleteMessage = async ({
  conversationId,
  messageId,
  previousMessageId,
}: Props) => {
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
};

export type MarkAsSeenProps = {
  messageId: string;
  memberId: string;
  conversationId: string;
};

export const markAsSeen = async ({
  memberId,
  messageId,
  conversationId,
}: MarkAsSeenProps) => {
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
};
