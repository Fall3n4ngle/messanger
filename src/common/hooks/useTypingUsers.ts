import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher/client";
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

    const handleStartTyping = (user: TypingUser) => {
      if (!userId || user.clerkId === userId) return;
      setTypingUsers((prev) => {
        if (prev.find((u) => u === user.userName)) return prev;
        return [...prev, user.userName];
      });
    };

    const handleStopTyping = ({ userName }: { userName: string }) => {
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
