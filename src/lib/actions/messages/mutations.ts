"use server";

import { getUserAuth } from "@/lib/utils";
import { MessageFields, messageSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "../user/queries";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";

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

      pusherServer.trigger(conversationId, "messages:new", upsertedMessage);

      const updatedConversation = await db.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageAt: new Date(),
        },
        include: {
          messages: true,
          members: true,
        },
      });

      return { success: true, data: upsertedMessage };
    } catch (error) {
      const message = (error as Error).message ?? "Failed to create message";
      console.log(message);
      return { success: false, error: message };
    }
  }
};

export const deleteMessage = async (messageId: string) => {
  try {
    const deletedMessage = await db.message.delete({
      where: { id: messageId },
    });

    return { success: true, data: deletedMessage };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to delete message";
    console.log(message);
    return { success: false, error: message };
  }
};
