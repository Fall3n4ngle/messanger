import { UserConversation } from "@/common/actions/conversation/queries";
import { getMessageSeen, shortenSentence } from "@/common/utils";

type GetLastMessageContent = {
  isOwn: boolean;
  content: string | null;
  file?: string | null;
  senderName: string;
  isGroup: boolean;
};

const getLastMessageContent = ({
  content,
  file,
  isOwn,
  senderName,
  isGroup,
}: GetLastMessageContent) => {
  let message;

  if (content && !file) {
    message = shortenSentence({
      maxLength: 18,
      sentence: content,
    });
  } else {
    message = "Sent a file";
  }

  let sender;

  if (isGroup) {
    if (isOwn) {
      sender = "You:";
    } else {
      sender = `${senderName}:`;
    }
  }

  return (
    <>
      <span className="text-primary font-semibold">{sender}</span>{" "}
      <span className="text-muted-foreground">{message}</span>
    </>
  );
};

type GetLastMessageDataProps = {
  isGroup: boolean;
  currentUserClerkId: string;
  lastMessage?: UserConversation["lastMessage"];
};

export const getLastMessageData = ({
  currentUserClerkId,
  isGroup,
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
    isGroup,
    isOwn,
    senderName: user.name,
  });

  return { seen, message };
};
