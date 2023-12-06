import { db } from "@/lib/db";

type Props = {
  currentUserId: string;
};

export const getUserConversations = async ({ currentUserId }: Props) => {
  const convsersations = await db.conversation.findMany({
    where: {
      users: {
        some: {
          id: currentUserId,
        },
      },
    },
    orderBy: {
      lastMessageAt: "desc",
    },
  });

  return convsersations;
};

export const getConversationById = async (conversationId: string) => {
  const conversation = await db.conversation.findFirst({
    where: { id: conversationId },
    select: {
      id: true,
      name: true,
      image: true,
      isGroup: true,
      creatorId: true,
      messages: {
        include: {
          seenBy: {
            select: {
              id: true,
            },
          },
          sentBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      users: true,
    },
  });

  return conversation;
};
