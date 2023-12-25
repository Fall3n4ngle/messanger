import { shortenSentence } from "@/lib/utils/shortenSentence";
import { LastMessage } from "../types";

type Props = {
  lastMessage: LastMessage;
  isGroup: boolean;
};

export const getLastMessageContent = ({ isGroup, lastMessage }: Props) => {
  if (!lastMessage) {
    return (
      <span className="text-muted-foreground">Conversation was started</span>
    );
  }

  let sender;
  let message;

  const { content, file, member } = lastMessage;

  if (isGroup) {
    sender = (
      <span className="text-primary font-semibold">{member.user.name}:</span>
    );
  }

  if (file) {
    message = <span>sent a file</span>;
  }

  if (content) {
    const formattedContent = shortenSentence({
      sentence: content,
      maxLength: 17,
    });

    message = <span>{formattedContent}</span>;
  }

  return (
    <>
      {sender} {message}
    </>
  );
};
