type SeenBy = {
  id: string;
};

export type Message = {
  id: string;
  content: string | null;
  file?: string | null;
  updatedAt: Date;
  conversationId: string;
  user: {
    id: string;
    image: string | null;
    name: string;
    clerkId: string;
  };
  seenBy: SeenBy[];
};
