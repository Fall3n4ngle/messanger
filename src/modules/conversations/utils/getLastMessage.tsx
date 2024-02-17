import { UserConversation } from "@/common/actions/conversation/queries";
import { getMessageSeen, shortenSentence } from "@/common/utils";

type GetLastMessageContent = {
  isOwn: boolean;
  content: string | null;
  file?: string | null;
  senderName: string;
};

const getLastMessageContent = ({
  content,
  isOwn,
  senderName,
}: GetLastMessageContent) => {
  let message;

  if (content) {
    message = shortenSentence({
      maxLength: 18,
      sentence: content,
    });
  }

  let sender;

  if (isOwn) {
    sender = "You:";
  } else {
    sender = `${senderName}:`;
  }

  return (
    <>
      <span className="font-semibold text-primary">{sender}</span>{" "}
      <span className="text-muted-foreground">{message}</span>
    </>
  );
};

type GetLastMessageDataProps = {
  currentUserClerkId: string;
  lastMessage?: UserConversation["lastMessage"];
};

export const getLastMessageData = ({
  currentUserClerkId,
  lastMessage,
}: GetLastMessageDataProps) => {
  if (!lastMessage) {
    return { message: "No messages yet", seen: null };
  }

  const { _count, content, file, user } = lastMessage;

  const isOwn = user.clerkId === currentUserClerkId;

  const seen = getMessageSeen({
    isOwn,
    isSeen: _count.seenBy > 0,
  });

  const message = getLastMessageContent({
    content,
    file,
    isOwn,
    senderName: user.name,
  });

  return { seen, message };
};
