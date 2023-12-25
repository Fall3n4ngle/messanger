"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { useTypingUsers } from "@/lib/hooks";
import { formatTypingUsers } from "@/lib/utils";

type Props = {
  image: string | null;
  name: string;
  conversationId: string;
  membersCount: number;
};

export default function ConversationHeading({
  image,
  name,
  conversationId,
  membersCount,
}: Props) {
  const typingUsers = useTypingUsers({ conversationId });

  return (
    <div className="flex gap-3 items-center">
      <Avatar>
        {image && <AvatarImage src={image} alt={`${name} image`} />}
        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="scroll-m-20 font-semibold tracking-tight whitespace-nowrap mb-1">
          {name}
        </h4>
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          {typingUsers.length > 0 ? (
            <span className="animate-pulse text-primary">
              {formatTypingUsers(typingUsers)}
            </span>
          ) : (
            `${membersCount} members`
          )}
        </p>
      </div>
    </div>
  );
}
