export type LastMessage = {
  id: string;
  content: string | null;
  updatedAt: Date;
  file: string | null;
  member: {
    user: {
      name: string;
    };
  };
} | null;

export type Conversation = {
  id: string;
  name: string;
  image: string | null;
  updatedAt: Date;
  lastMessage: LastMessage;
  isGroup: boolean;
};
