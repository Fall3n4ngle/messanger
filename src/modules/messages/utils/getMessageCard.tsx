import { MemberRole } from "@prisma/client";
import {
  MessageCard,
  WithControls,
  WithSeenOnScroll,
} from "../components/messageCard";
import { getMessageSeen } from "@/common/utils";
import { Message } from "@/common/actions/messages/queries";

type Props = {
  memberRole: MemberRole;
  isOwn: boolean;
  isActive: boolean;
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
