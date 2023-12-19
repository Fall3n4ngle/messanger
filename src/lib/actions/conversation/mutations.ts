"use server";

import { ConversationFields, conversationSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { getUserAuth } from "@/lib/utils";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "../user/queries";
import { revalidatePath } from "next/cache";
import { MemberRole } from "@prisma/client";

export const upsertConversation = async (fields: ConversationFields) => {
  const result = conversationSchema.safeParse(fields);

  if (result.success) {
    const {
      data: { id, members, isGroup, ...values },
    } = result;
    try {
      const { session } = await getUserAuth();
      if (!session) redirect("/sign-in");

      const currentUser = await getUserByClerkId(session.user.id);
      if (!currentUser) redirect("/onboarding");

      const mappedMembers = members
        .map((member) => ({
          userId: member.id,
          role: "VIEW" as MemberRole,
        }))
        .concat({
          userId: currentUser.id,
          role: "ADMIN",
        });

      const newConversations = await db.conversation.upsert({
        where: { id },
        create: {
          isGroup,
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
      });

      revalidatePath("/conversations");

      return { success: true, data: newConversations };
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

export const deleteConversation = async (conversationId: string) => {
  try {
    const deletedConversation = await db.conversation.delete({
      where: { id: conversationId },
    });

    revalidatePath("/conversations");

    return { success: true, data: deletedConversation };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to delete conversation";
    console.log(message);
    return { success: false, error: message };
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
    const message = (error as Error).message ?? "Failed to delete conversation";
    console.log(message);
    return { success: false, error: message };
  }
};
