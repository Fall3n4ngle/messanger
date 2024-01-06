"use server";

import {
  AddMembersFields,
  ConversationFields,
  UpdateGroupFields,
  addMembersSchema,
  conversationSchema,
  updateGroupSchema,
} from "@/lib/validations";
import { db } from "@/lib/db";
import { getUserAuth } from "@/lib/utils";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "../user/queries";
import { revalidatePath } from "next/cache";
import { MemberRole } from "@prisma/client";
import { pusherServer } from "@/lib/pusher/server";

export const createGroup = async (fields: ConversationFields) => {
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

      const createdGroup = await db.conversation.create({
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
          isGroup: true,
          messages: {
            where: {
              AND: {
                seenBy: {
                  none: {
                    userId: currentUser.id,
                  },
                },
                member: {
                  userId: {
                    not: currentUser.id,
                  },
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
              member: {
                select: {
                  user: {
                    select: {
                      clerkId: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          members: {
            select: {
              userId: true,
            },
          },
        },
      });

      const { members, ...conversation } = createdGroup;

      members.forEach((member) => {
        pusherServer.trigger(member.userId, "conversation:new", conversation);
      });

      return { success: true, data: conversation };
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

export const updateGroup = async (fields: UpdateGroupFields) => {
  const result = updateGroupSchema.safeParse(fields);

  if (result.success) {
    const { id, ...fields } = result.data;

    try {
      const updatedGroup = await db.conversation.update({
        where: { id },
        data: fields,
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

      const { members, ...conversation } = updatedGroup;

      members.forEach((member) => {
        pusherServer.trigger(
          member.userId,
          "conversation:update",
          conversation
        );
      });

      revalidatePath(`/conversations/${id}`);

      return { success: true, data: conversation };
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

export const addMembers = async (fields: AddMembersFields) => {
  const result = addMembersSchema.safeParse(fields);

  if (result.success) {
    try {
      const { members: newMembers, id } = result.data;

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
      });

      revalidatePath(`/conversations/${id}`);

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

export const revalidateConversationPath = async (conversationId: string) => {
  return revalidatePath(`/conversations/${conversationId}`);
};
