import { MemberRole } from "@prisma/client";
import { Message } from "../../../lib/types";
import { MessageCard, WithControls, WithSeenOnScroll } from "../../messageCard";
import { getMessageSeen } from "@/lib/utils";

type Props = {
  memberRole: MemberRole;
  isOwn: boolean;
  isActive: boolean;
  previousMessageId: string | null;
  memberId: string;
} & Message;

export const getMessageCard = ({
  isOwn,
  memberRole,
  id,
  member,
  seenBy,
  conversationId,
  updatedAt,
  isActive,
  previousMessageId,
  memberId,
  ...props
}: Props) => {
  const seen = getMessageSeen({
    isOwn,
    isSeen: seenBy.length > 0,
  });

  const seenByMember = seenBy.some((m) => m.id === memberId)

  let result = (
    <MessageCard
      key={id}
      isOwn={isOwn}
      isActive={isActive}
      updatedAt={updatedAt}
      member={member}
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

  if (!isOwn && !seenByMember) {
    result = (
      <WithSeenOnScroll
        memberId={memberId}
        messageId={id}
        seen={seenByMember}
        conversationId={conversationId}
        key={id}
      >
        {result}
      </WithSeenOnScroll>
    );
  }

  return result;
};
