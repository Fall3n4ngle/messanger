export type LastMessage = {
  id: string;
  content: string | null;
  updatedAt: Date;
  file: string | null;
  member: {
    user: {
      clerkId: string;
      name: string;
    };
  };
} | null;

type Message = {
  id: string;
};

export type Conversation = {
  id: string;
  name: string;
  image: string | null;
  updatedAt: Date;
  lastMessage: LastMessage;
  messages: Message[];
  isGroup: boolean;
};
