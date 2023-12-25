import { useEffect, useState } from "react";
import { pusherClient } from "../pusher/client";
import { TypingUser } from "../actions/typingUser/mutations";
import { useAuth } from "@clerk/nextjs";

type Props = {
  conversationId: string;
};

export const useTypingUsers = ({ conversationId }: Props) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const handleAddUser = (user: TypingUser) => {
      if (user.clerkId === userId) return;
      setTypingUsers((prev) => [...prev, user.userName]);
    };

    const handleRemoveUser = ({ userName }: { userName: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== userName));
    };

    pusherClient.bind("user:start_typing", handleAddUser);

    pusherClient.bind("user:stop_typing", handleRemoveUser);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("start_typing", handleAddUser);
      pusherClient.unbind("user:stop_typing", handleRemoveUser);
    };
  }, [conversationId, userId]);

  return typingUsers;
};
