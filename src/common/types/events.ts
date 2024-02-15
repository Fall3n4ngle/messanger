export type ConversationEvent = {
  conversationId: string;
};

export type MemberEvent = {
  conversationName: string;
};

export type ChangeRoleEvent = {
  conversationId: string;
  newRole: string;
  conversationName: string;
};
