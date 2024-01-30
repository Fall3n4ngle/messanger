"use server";

import { auth } from "@clerk/nextjs";
import {
  AddMembersFields,
  addMembersSchema,
} from "@/common/validations/conversation";
import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { ConversationEvent } from "@/common/types/events";
import { revalidatePath } from "next/cache";

export const addMembers = async (fields: AddMembersFields) => {
  const result = addMembersSchema.safeParse(fields);

  if (result.success) {
    const { members: newMembers, id } = result.data;

    try {
      const { userId } = auth();

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

          pusherServer.trigger(
            conversationChannel,
            "conversation:add_members",
            {
              conversationId: id,
            } as ConversationEvent
          );
        }
      });

      return { success: true, data: updatedConversation };
    } catch (error) {
      const message = (error as Error).message ?? "Failed to create group";
      console.log(message);
      throw new Error(message);
    }
  }

  if (result.error) {
    throw new Error(result.error.toString());
  }
};
