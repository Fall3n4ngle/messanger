export const formatTypingUsers = (users: string[]) => {
  if (users.length === 1) {
    return `${users[0]} is typing...`;
  }

  return `${users.length} people are typing...`;
};
