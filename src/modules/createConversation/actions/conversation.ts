"use server";

import {
  CreateConversationFields,
  createConversationSchema,
} from "../validations/conversation";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "@/common/actions/user/queries";
import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { getUserAuth } from "@/common/dataAccess";

export const createConversation = async (fields: CreateConversationFields) => {
  const result = createConversationSchema.safeParse(fields);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const { userId } = await getUserAuth();
  const { members: newMembers, ...values } = result.data;

  try {
    const currentUser = await getUserByClerkId(userId);
    if (!currentUser) redirect("/onboarding");

    const mappedMembers = newMembers
      .map((member) => ({
        userId: member.id,
        role: "VIEW" as MemberRole,
      }))
      .concat({
        userId: currentUser.id,
        role: "ADMIN" as MemberRole,
      });

    const createdConversation = await db.conversation.create({
      data: {
        userId: currentUser.id,
        ...values,
        members: {
          createMany: {
            data: mappedMembers,
          },
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        updatedAt: true,
        messages: {
          where: {
            AND: {
              seenBy: {
                none: {
                  id: currentUser.id,
                },
              },
              userId: {
                not: currentUser.id,
              },
            },
          },
          select: {
            id: true,
          },
        },
        lastMessage: {
          select: {
            id: true,
            content: true,
            updatedAt: true,
            file: true,
            user: {
              select: {
                clerkId: true,
                name: true,
              },
            },
          },
        },
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

    const { members, ...conversation } = createdConversation;

    members.forEach((member) => {
      if (member.user.clerkId !== userId) {
        const conversationChannel = `${member.user.clerkId}_conversations`;

        pusherServer.trigger(conversationChannel, "conversation:new", {});
      }
    });

    return { success: true, data: conversation };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to create conversation";
    console.log(message);
    throw new Error(message);
  }
};
