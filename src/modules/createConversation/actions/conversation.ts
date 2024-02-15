"use server";

import {
  CreateConversationFields,
  createConversationSchema,
} from "../validations/conversation";
import { redirect } from "next/navigation";
import { getUser } from "@/common/actions/user/queries";
import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { getUserAuth } from "@/common/dataAccess";
import { getMemberChannel } from "@/common/utils";
import { memberEvents } from "@/common/const";
import { MemberEvent } from "@/common/types";

export const createConversation = async (fields: CreateConversationFields) => {
  const result = createConversationSchema.safeParse(fields);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const { userId } = await getUserAuth();
  const { members: newMembers, ...values } = result.data;

  try {
    const currentUser = await getUser();
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
        name: true,
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

    createdConversation.members.forEach((member) => {
      if (member.user.clerkId !== userId) {
        const memberChannel = getMemberChannel({
          userId: member.user.clerkId,
        });

        pusherServer.trigger(memberChannel, memberEvents.join, {
          conversationName: createdConversation.name,
        } as MemberEvent);
      }
    });

    return { success: true, data: createdConversation };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to create conversation";
    console.log(message);
    throw new Error(message);
  }
};
