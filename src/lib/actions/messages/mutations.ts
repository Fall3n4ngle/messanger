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

      const upsertedMessage = await db.message.upsert({
        where: { id: id ?? "" },
        create: { ...data, conversationId, senderId: currentUser.id },
        update: data,
        select: {
          content: true,
          file: true,
          id: true,
          seenBy: {
            select: {
              id: true,
            },
          },
          sentBy: {
            select: {
              name: true,
              image: true,
              clerkId: true,
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
          users: true,
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
