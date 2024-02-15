export const conversationEvents = {
  deleteMember: "conversation:delete_member",
  updateConversation: "conversation:update",
  addMembers: "conversation:add_members",
  changeMemberRole: "conversation:change_member_role",
};

export const messageEvents = {
  newMessage: "message:new",
  deleteMessage: "message:delete",
  updateMessage: "message:update",
  markAsSeen: "message:seen",
};

export const memberEvents = {
  changeRole: "member:change_role",
  leave: "member:leave",
  join: "member:join",
};
