"use server";

import { getUserAuth } from "@/lib/utils";
import { MessageFields, messageSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "../user/queries";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { auth } from "@clerk/nextjs";

export type UpdateMessage = {
  id?: string;
  content: string | null;
  file: string | null;
};

type Message = {
  id: string;
};

export type NewMessage = {
  id: string;
  messages: Message[];
  lastMessage: {
    id: string;
    content: string | null;
    updatedAt: Date;
    file: string | null;
    member: {
      user: {
        clerkId: string;
        name: string;
      };
    };
  } | null;
};

export const upsertMessage = async (fields: MessageFields) => {
  const result = messageSchema.safeParse(fields);

  if (result.success) {
    const {
      data: { id, conversationId, ...data },
    } = result;
    try {
      const { session } = await getUserAuth();
      if (!session) redirect("/sign-in");

      const currentUser = await getUserByClerkId(session.user.id);
      if (!currentUser) redirect("/onboarding");

      if (!currentUser) redirect("/onboarding");

      const conversation = await db.conversation.findFirst({
        where: { id: conversationId },
        include: {
          members: true,
        },
      });

      if (!conversation) {
        return { success: false, error: "Conversation not found" };
      }

      const member = conversation.members.find(
        (member) => member.userId === currentUser.id
      );

      if (!member) {
        return { success: false, error: "Member not found" };
      }

      const upsertedMessage = await db.message.upsert({
        where: { id: id ?? "" },
        create: {
          conversationId,
          memberId: member.id,
          ...data,
        },
        update: data,
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

      if (id) {
        pusherServer.trigger(conversationId, "messages:update", {
          id: upsertedMessage.id,
          file: upsertedMessage.file,
          content: upsertedMessage.content,
        } as UpdateMessage);
      } else {
        pusherServer.trigger(conversationId, "messages:new", upsertedMessage);

        const updatedConversation = await db.conversation.update({
          where: { id: conversationId },
          data: {
            lastMessageId: upsertedMessage.id,
          },
          select: {
            id: true,
            lastMessage: {
              select: {
                id: true,
                content: true,
                updatedAt: true,
                member: {
                  select: {
                    user: {
                      select: {
                        clerkId: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
            members: {
              select: {
                userId: true,
              },
            },
          },
        });

        const { members, ...values } = updatedConversation;

        members.forEach((member) => {
          pusherServer.trigger(
            member.userId,
            "conversation:new_message",
            values
          );
        });
      }

      return { success: true, data: upsertedMessage };
    } catch (error) {
      const message = (error as Error).message ?? "Failed to upsert message";
      console.log(message);
      return { success: false, error: message };
    }
  }
};

type Props = {
  messageId: string;
  conversationId: string;
};

export type DeleteMessage = {
  messageId: string;
  clerkId: string;
};

export const deleteMessage = async ({ conversationId, messageId }: Props) => {
  try {
    const { userId } = auth();

    if (!userId) redirect("/sign-in");

    const deletedMessage = await db.message.delete({
      where: { id: messageId },
      select: {
        id: true,
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

    if (userId) {
      pusherServer.trigger(conversationId, "messages:delete", {
        messageId,
        clerkId: userId,
      } as DeleteMessage);
    }

    return { success: true, data: deletedMessage };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to delete message";
    console.log(message);
    return { success: false, error: message };
  }
};

export type MarkAsSeenProps = {
  messageId: string;
  memberId: string;
  conversationId: string;
};

export const markAsSeen = async ({ memberId, messageId }: MarkAsSeenProps) => {
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
    });

    return { success: true, data: updatedMessage };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to delete message";
    console.log(message);
    return { success: false, error: message };
  }
};
