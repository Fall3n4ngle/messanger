"use server";

import { ConversationFields, conversationSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { getUserAuth } from "@/lib/utils";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "../user/queries";
import { revalidatePath } from "next/cache";
import { MemberRole } from "@prisma/client";
import { pusherServer } from "@/lib/pusher/server";

export const upsertGroup = async (fields: ConversationFields) => {
  const result = conversationSchema.safeParse(fields);

  if (result.success) {
    const {
      data: { id, members: newMembers, ...values },
    } = result;
    try {
      const { session } = await getUserAuth();
      if (!session) redirect("/sign-in");

      const currentUser = await getUserByClerkId(session.user.id);
      if (!currentUser) redirect("/onboarding");

      const mappedMembers = newMembers
        .map((member) => ({
          userId: member.id,
          role: "VIEW" as MemberRole,
        }))
        .concat({
          userId: currentUser.id,
          role: "ADMIN",
        });

      const upsertedConversation = await db.conversation.upsert({
        where: { id },
        create: {
          userId: currentUser.id,
          ...values,
          members: {
            createMany: {
              data: mappedMembers,
            },
          },
        },
        update: {
          ...values,
        },
        select: {
          id: true,
          name: true,
          image: true,
          lastMessage: true,
          members: {
            select: {
              userId: true,
            },
          },
        },
      });

      const { members, ...conversation } = upsertedConversation;

      const notifyMembers = (key: string) => {
        members.forEach((member) => {
          pusherServer.trigger(member.userId, key, conversation);
        });
      };

      if (id) {
        notifyMembers("conversation:update");
      } else {
        notifyMembers("conversation:new");
      }

      return { success: true, data: conversation };
    } catch (error) {
      const message = (error as Error).message ?? "Failed to upsert user";
      console.log(message);
      return { success: false, error: message };
    }
  }

  if (result.error) {
    return { success: false, error: result.error.format() };
  }
};

type Props = {
  conversationId: string;
  userClerkId: string;
};

export const leaveConversation = async ({
  conversationId,
  userClerkId,
}: Props) => {
  try {
    const user = await getUserByClerkId(userClerkId);
    if (!user) redirect("/onboarding");

    const member = await db.member.findFirst({
      where: {
        userId: user.id,
        conversationId: conversationId,
      },
    });

    if (!member) {
      return { succes: false, error: "Member not found" };
    }

    const updatedMember = await db.member.update({
      where: {
        id: member.id,
      },
      data: {
        conversationId: null,
      },
    });

    revalidatePath("/conversations");

    return { success: true, data: updatedMember };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to leave conversation";
    console.log(message);
    return { success: false, error: message };
  }
};

const createConversation = async ({ companionId }: { companionId: string }) => {
  try {
  } catch (error) {}
};
