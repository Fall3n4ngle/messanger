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
        ? newMembers
            .map((member) => ({
              userId: member.id,
              role: "VIEW" as MemberRole,
            }))
            .concat({
              userId: currentUser.id,
              role: "ADMIN",
            })
        : [];

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
        revalidatePath(`/conversations/${id}`);
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
  memberId: string;
  conversationId: string;
};

export const leaveConversation = async ({
  memberId,
  conversationId,
}: Props) => {
  try {
    const deletedMember = await db.member.delete({
      where: {
        id: memberId,
      },
    });

    revalidatePath("/conversations");

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
      },
      select: {
        members: {
          select: {
            _count: true,
          },
        },
      },
    });

    if (conversation?.members.length === 0) {
      await db.conversation.delete({
        where: {
          id: conversationId,
        },
      });
    }

    return { success: true, data: deletedMember };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to leave conversation";
    console.log(message);
    return { success: false, error: message };
  }
};
