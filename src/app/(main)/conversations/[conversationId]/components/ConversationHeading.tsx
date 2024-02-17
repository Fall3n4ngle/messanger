"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/ui";
import { useConversation, useTypingUsers } from "@/common/hooks";
import { formatTypingUsers } from "@/common/utils";
import { useParams } from "next/navigation";

export default function ConversationHeading() {
  const conversationId = useParams().conversationId as string;
  const typingUsers = useTypingUsers({ conversationId });
  const { data: conversation } = useConversation({ conversationId });

  if (!conversation) return null;
  const { image, name, members } = conversation;

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        {image && <AvatarImage src={image} alt={`${name} image`} />}
        <AvatarFallback className="bg-primary text-primary-foreground">
          {name[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h4 className="mb-1 scroll-m-20 whitespace-nowrap font-semibold tracking-tight">
          {name}
        </h4>
        <p className="whitespace-nowrap text-sm text-muted-foreground">
          {typingUsers.length > 0 ? (
            <span className="animate-pulse text-primary">
              {formatTypingUsers(typingUsers)}
            </span>
          ) : (
            `${members.length} members`
          )}
        </p>
      </div>
    </div>
  );
}
