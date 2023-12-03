"use server";

import { ConversationFields, conversationSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { getUserAuth } from "@/lib/utils";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "../user/queries";
import { revalidatePath } from "next/cache";

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

      const newConversations = await db.conversation.upsert({
        where: { id },
        create: {
          isGroup,
          creatorId: currentUser.id,
          ...values,
          users: {
            connect: members.concat({ id: currentUser.id }),
          },
        },
        update: {
          ...values,
          users: {
            connect: members.concat({ id: currentUser.id }),
          },
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
