"use server";

import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import {
  ChangeRoleEvent,
  ConversationEvent,
  MemberEvent,
} from "@/common/types";
import {
  ChangeRoleFields,
  DeleteMemberFields,
  changeRoleSchema,
  deleteMemberSchema,
} from "../validations/member";
import { canMutateConversation, getUserAuth } from "@/common/dataAccess";
import { getConversationsChannel, getMemberChannel } from "@/common/utils";
import { conversationEvents, memberEvents } from "@/common/const";

export const changeMemberRole = async (data: ChangeRoleFields) => {
  const result = changeRoleSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const { userId } = await getUserAuth();
  const { role, memberId, conversationId } = result.data;

  try {
    const canMutate = await canMutateConversation(userId, conversationId);

    if (!canMutate) {
      throw new Error(
        "You must be an admin of a conversation to delete member",
      );
    }

    const conversation = await db.conversation.findFirst({
      where: { id: conversationId },
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

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const updatedMember = await db.member.update({
      select: {
        user: {
          select: {
            clerkId: true,
          },
        },
      },
      where: {
        id: memberId,
      },
      data: {
        role,
      },
    });

    conversation?.members.forEach((member) => {
      if (member.user.clerkId !== userId) {
        if (member.user.clerkId === updatedMember.user.clerkId) {
          const memberCahnnel = getMemberChannel({
            userId: member.user.clerkId,
          });

          pusherServer.trigger(memberCahnnel, memberEvents.changeRole, {
            conversationId,
            newRole: role,
            conversationName: conversation.name,
          } as ChangeRoleEvent);

          return;
        }

        const conversationsChannel = getConversationsChannel({
          userId: member.user.clerkId,
        });

        pusherServer.trigger(
          conversationsChannel,
          conversationEvents.changeMemberRole,
          {
            conversationId,
          } as ConversationEvent,
        );
      }
    });

    return { success: true, data: updatedMember };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to change member role";
    console.log(message);
    throw new Error(message);
  }
};

export const deleteMember = async (data: DeleteMemberFields) => {
  const result = deleteMemberSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const { userId } = await getUserAuth();
  const { conversationId, memberId } = result.data;

  try {
    const canMutate = await canMutateConversation(userId, conversationId);

    if (!canMutate) {
      throw new Error(
        "You must be an admin of a conversation to delete member",
      );
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
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

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const deletedMember = await db.member.delete({
      where: {
        id: memberId,
      },
      select: {
        user: {
          select: {
            clerkId: true,
          },
        },
      },
    });

    conversation.members.forEach((member) => {
      if (member.user.clerkId !== userId) {
        if (member.user.clerkId === deletedMember.user.clerkId) {
          const memberChannel = getMemberChannel({
            userId: member.user.clerkId,
          });

          pusherServer.trigger(memberChannel, memberEvents.leave, {
            conversationName: conversation.name,
          } as MemberEvent);

          return;
        }

        const conversationsChannel = getConversationsChannel({
          userId: member.user.clerkId,
        });

        pusherServer.trigger(
          conversationsChannel,
          conversationEvents.deleteMember,
          {
            conversationId,
          } as ConversationEvent,
        );
      }
    });

    return { success: true, data: deletedMember };
  } catch (error) {
    const message = (error as Error).message ?? "Failed to delete member";
    console.log(message);
    throw new Error(message);
  }
};

export const leaveConversation = async (data: DeleteMemberFields) => {
  const result = deleteMemberSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.toString());
  }

  const { userId } = await getUserAuth();
  const { conversationId, memberId } = result.data;

  try {
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
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

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const deletedMember = await db.member.delete({
      where: {
        id: memberId,
      },
      select: {
        user: {
          select: {
            clerkId: true,
          },
        },
      },
    });

    conversation.members.forEach((member) => {
      if (member.user.clerkId !== userId) {
        const conversationsChannel = getConversationsChannel({
          userId: member.user.clerkId,
        });

        pusherServer.trigger(
          conversationsChannel,
          conversationEvents.deleteMember,
          {
            conversationId,
          } as ConversationEvent,
        );
      }
    });

    return { success: true, data: deletedMember };
  } catch (error) {
    const message = (error as Error).message ?? "Failed leave conversation";
    console.log(message);
    throw new Error(message);
  }
};
