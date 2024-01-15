import { MemberRole } from "@prisma/client";

type SeenBy = {
  id: string;
};

export type Message = {
  id: string;
  content: string | null;
  file?: string | null;
  updatedAt: Date;
  conversationId: string;
  member: {
    id: string;
    role: MemberRole;
    user: {
      image: string | null;
      name: string;
      clerkId: string;
    };
  };
  seenBy: SeenBy[];
};