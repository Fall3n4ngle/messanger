"use server";

import { getUserAuth } from "@/lib/utils";
import { MessageFields, messageSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "../user/queries";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";

export type UpdateMessage = {
  id?: string;
  content: string | null;
  file: string | null;
};

export type NewMessage = {
  id: string;
  lastMessage: {
    id: string;
    content: string | null;
    updatedAt: Date;
    member: {
      user: {
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
        include: {
          member: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                  clerkId: true,
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
      }

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
        pusherServer.trigger(member.userId, "conversation:new_message", values);
      });

      return { success: true, data: upsertedMessage };
    } catch (error) {
      const message = (error as Error).message ?? "Failed to upsert message";
      console.log(message);
      return { success: false, error: message };
    }
  }
};

type Props = {
  id: string;
  conversationId: string;
};

export const deleteMessage = async ({ conversationId, id }: Props) => {
  try {
    const deletedMessage = await db.message.delete({
      where: { id },
    });

    pusherServer.trigger(conversationId, "messages:delete", { id });

    return { success: true, data: deletedMessage };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to delete message";
    console.log(message);
    return { success: false, error: message };
  }
};
