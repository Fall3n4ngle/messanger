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

      const updatedGroup = await db.conversation.update({
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

      updatedGroup.members.forEach((member) => {
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

      return { success: true, data: updatedGroup };
    } catch (error) {
      const message = (error as Error).message ?? "Failed to create group";
      console.log(message);
      return { success: false, error: message };
    }
  }

  if (result.error) {
    return { success: false, error: result.error.format() };
  }
};
