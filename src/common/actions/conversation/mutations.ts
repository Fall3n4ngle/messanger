"use server";

import {
  AddMembersFields,
  addMembersSchema,
} from "@/common/validations/conversation";
import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { ConversationEvent } from "@/common/types/events";
import { revalidatePath } from "next/cache";
import { canMutateConversation, getUserAuth } from "@/common/dataAccess";

export const addMembers = async (fields: AddMembersFields) => {
  const result = addMembersSchema.safeParse(fields);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const { members: newMembers, id } = result.data;
  const { userId } = await getUserAuth();

  try {
    if (!canMutateConversation(userId, id)) {
      throw new Error("You must be an admin of a conversation to update it");
    }

    const mappedMembers = newMembers.map((member) => ({
      userId: member.id,
      role: "VIEW" as MemberRole,
    }));

    const updatedConversation = await db.conversation.update({
      where: { id },
      data: {
        members: {
          createMany: {
            data: mappedMembers,
          },
        },
      },
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

    revalidatePath(`/conversations/${id}`);

    updatedConversation.members.forEach((member) => {
      if (member.user.clerkId !== userId) {
        const conversationChannel = `${member.user.clerkId}_conversations`;

        pusherServer.trigger(conversationChannel, "conversation:add_members", {
          conversationId: id,
        } as ConversationEvent);
      }
    });

    return { success: true, data: updatedConversation };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to create group";
    console.log(message);
    throw new Error(message);
  }
};
