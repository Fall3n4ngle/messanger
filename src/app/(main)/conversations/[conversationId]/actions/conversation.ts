import { db } from "@/lib/db";

export const getConversationById = async (conversationId: string) => {
  try {
    const conversation = await db.conversation.findFirst({
      where: { id: conversationId },
      select: {
        id: true,
        name: true,
        image: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                clerkId: true,
              },
            },
          },
        },
      },
    });

    return conversation;
  } catch {
    throw new Error("Failed to get conversation");
  }
};
