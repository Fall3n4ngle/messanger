import { db } from "@/lib/db";

type Props = {
  query?: string;
  currentUserId: string;
};

export const getUserConversations = async ({
  currentUserId,
  query = "",
}: Props) => {
  const convsersations = await db.conversation.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
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
