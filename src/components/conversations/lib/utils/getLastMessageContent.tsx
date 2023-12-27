import { shortenSentence } from "@/lib/utils/shortenSentence";
import { LastMessage } from "../types";

type Props = {
  lastMessage: LastMessage;
  isGroup: boolean;
  currentUserClerkId?: string | null;
};

export const getLastMessageContent = ({
  isGroup,
  lastMessage,
  currentUserClerkId,
}: Props) => {
  if (!lastMessage) {
    return (
      <span className="text-muted-foreground">Conversation was started</span>
    );
  }

  let message;

  const { file, content, member } = lastMessage;

  if (content) {
    const formattedContent = shortenSentence({
      maxLength: 18,
      sentence: content,
    });

    message = <span className="text-muted-foreground">{formattedContent}</span>;
  }

  if (file) {
    message = <span className="text-muted-foreground">sent a file</span>;
  }

  if (!isGroup) {
    return message;
  }

  let sender;

  if (currentUserClerkId === member.user.clerkId) {
    sender = <span className="text-primary font-semibold">You: </span>;
  } else {
    sender = (
      <span className="text-primary font-semibold">{member.user.name}: </span>
    );
  }

  return (
    <>
      {sender} {message}
    </>
  );
};
