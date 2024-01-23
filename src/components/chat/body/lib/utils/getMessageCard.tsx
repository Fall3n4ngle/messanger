import { MemberRole } from "@prisma/client";
import { Message } from "../../../lib/types";
import { MessageCard, WithControls, WithSeenOnScroll } from "../../messageCard";
import { getMessageSeen } from "@/lib/utils";

type Props = {
  memberRole: MemberRole;
  isOwn: boolean;
  isActive: boolean;
  previousMessageId: string | null;
  userId: string;
} & Message;

export const getMessageCard = ({
  isOwn,
  memberRole,
  id,
  seenBy,
  conversationId,
  updatedAt,
  isActive,
  previousMessageId,
  user,
  userId,
  ...props
}: Props) => {
  const seen = getMessageSeen({
    isOwn,
    isSeen: seenBy.length > 0,
  });

  const seenByUser = !!seenBy.find((m) => m.id === user.id);

  let result = (
    <MessageCard
      key={id}
      isOwn={isOwn}
      isActive={isActive}
      updatedAt={updatedAt}
      user={user}
      seen={seen}
      {...props}
    />
  );

  if (isOwn || memberRole !== "VIEW") {
    result = (
      <WithControls
        conversationId={conversationId}
        messageId={id}
        key={id}
        previousMessageId={previousMessageId}
        {...props}
      >
        {result}
      </WithControls>
    );
  }

  if (!isOwn && !seenByUser) {
    result = (
      <WithSeenOnScroll
        userId={userId}
        messageId={id}
        conversationId={conversationId}
        key={id}
      >
        {result}
      </WithSeenOnScroll>
    );
  }

  return result;
};
