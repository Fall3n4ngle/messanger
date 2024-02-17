"use server";

import {
  AddMembersFields,
  addMembersSchema,
} from "@/common/validations/conversation";
import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { ConversationEvent, MemberEvent } from "@/common/types";
import { canMutateConversation, getUserAuth } from "@/common/dataAccess";
import { getConversationsChannel, getMemberChannel } from "@/common/utils";
import { conversationEvents, memberEvents } from "@/common/const";

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
        name: true,
        members: {
          select: {
            user: {
              select: {
                id: true,
                clerkId: true,
              },
            },
          },
        },
      },
    });

    updatedConversation.members.forEach((member) => {
      if (member.user.clerkId !== userId) {
        if (newMembers.find(({ id }) => id === member.user.id)) {
          const memberChannel = getMemberChannel({
            userId: member.user.clerkId,
          });

          pusherServer.trigger(memberChannel, memberEvents.join, {
            conversationName: updatedConversation.name,
          } as MemberEvent);

          return;
        }

        const conversationChannel = getConversationsChannel({
          userId: member.user.clerkId,
        });

        pusherServer.trigger(
          conversationChannel,
          conversationEvents.addMembers,
          {
            conversationId: id,
          } as ConversationEvent,
        );
      }
    });

    return { success: true, data: updatedConversation };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to add members";
    console.log(message);
    throw new Error(message);
  }
};
