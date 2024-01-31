import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher/client";
import { useAuth } from "@clerk/nextjs";

type Props = {
  conversationId: string;
};

type User = {
  userName: string;
  clerkId: string;
};

export const useTypingUsers = ({ conversationId }: Props) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const handleStartTyping = (user: User) => {
      if (!userId || user.clerkId === userId) return;
      setTypingUsers((prev) => {
        if (prev.find((u) => u === user.userName)) return prev;
        return [...prev, user.userName];
      });
    };

    const handleStopTyping = ({ userName }: Pick<User, "userName">) => {
      setTypingUsers((prev) => prev.filter((u) => u !== userName));
    };

    pusherClient.bind("user:start_typing", handleStartTyping);

    pusherClient.bind("user:stop_typing", handleStopTyping);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("start_typing", handleStartTyping);
      pusherClient.unbind("user:stop_typing", handleStopTyping);
    };
  }, [conversationId, userId, typingUsers]);

  return typingUsers;
};
