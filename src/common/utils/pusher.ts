type Props = {
  userId: string;
};

export const getConversationsChannel = ({ userId }: Props) => {
  return `${userId}_conversations`;
};

export const getMessagesChannel = ({ userId }: Props) => {
  return `${userId}_messages`;
};

export const getMemberChannel = ({ userId }: Props) => {
  return `${userId}_member`;
};
