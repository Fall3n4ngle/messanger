"use server";

import {
  AddMembersFields,
  CreateConversationFields,
  UpdateGroupFields,
  addMembersSchema,
  createConversationSchema,
  updateGroupSchema,
} from "@/lib/validations";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "../user/queries";
import { revalidatePath } from "next/cache";
import { MemberRole } from "@prisma/client";
import { pusherServer } from "@/lib/pusher/server";
import { auth } from "@clerk/nextjs";

export const createGroup = async (fields: CreateConversationFields) => {
  const result = createConversationSchema.safeParse(fields);

  if (result.success) {
    const {
      data: { members: newMembers, ...values },
    } = result;

    try {
      const { userId } = auth();
      if (!userId) redirect("/sign-in");

      const currentUser = await getUserByClerkId(userId);
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
              user: {
                select: {
                  clerkId: true,
                },
              },
            },
          },
        },
      });

      const { members, ...conversation } = createdGroup;

      members.forEach((member) => {
        if (member.user.clerkId !== userId) {
          const conversationChannel = `${member.user.clerkId}_conversations`;

          pusherServer.trigger(conversationChannel, "conversation:new", {});
        }
      });

      return { success: true, data: conversation };
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

export type UpdateConversationEvent = {
  id: string;
  name?: string;
  image?: string | null;
};

export const updateGroup = async (fields: UpdateGroupFields) => {
  const result = updateGroupSchema.safeParse(fields);

  if (result.success) {
    const { id, ...fields } = result.data;

    try {
      const { userId } = auth();

      const updatedGroup = await db.conversation.update({
        where: { id },
        data: fields,
        select: {
          id: true,
          name: true,
          image: true,
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

      const { members, ...conversation } = updatedGroup;

      members.forEach((member) => {
        if (member.user.clerkId !== userId) {
          const conversationChannel = `${member.user.clerkId}_conversations`;

          pusherServer.trigger(
            conversationChannel,
            "conversation:update",
            conversation as UpdateConversationEvent
          );
        }
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

export type AddMembersEvent = {
  conversationId: string;
};

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
            } as AddMembersEvent
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

export const revalidateConversationPath = async (conversationId: string) => {
  return revalidatePath(`/conversations/${conversationId}`);
};
