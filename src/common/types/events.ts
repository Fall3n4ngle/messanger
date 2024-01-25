export type ConversationEvent = {
  conversationId: string;
};

export type DeleteMemberEvent = {
  conversationId: string;
  userId: string;
  conversationName: string;
};
