"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { TypingUser } from "@/lib/actions/typingUser/mutations";
import { pusherClient } from "@/lib/pusher/client";
import { formatTypingUsers } from "@/lib/utils";
import { useTypingUsers } from "@/store";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

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
  const { add, users, remove } = useTypingUsers();
  const { userId } = useAuth();

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const handleAddUser = (user: TypingUser) => {
      if (user.clerkId === userId) return;
      add(user.userName);
    };

    const handleRemoveUser = ({ userName }: { userName: string }) => {
      remove(userName);
    };

    pusherClient.bind("user:start_typing", handleAddUser);

    pusherClient.bind("user:stop_typing", handleRemoveUser);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("start_typing", handleAddUser);
      pusherClient.unbind("user:stop_typing", handleRemoveUser);
    };
  }, [conversationId, add, remove, userId]);

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
          {users.length > 0 ? (
            <span className="animate-pulse text-primary">
              {formatTypingUsers(users)}
            </span>
          ) : (
            `${membersCount} members`
          )}
        </p>
      </div>
    </div>
  );
}
