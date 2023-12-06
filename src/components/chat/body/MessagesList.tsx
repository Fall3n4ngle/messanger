import { pusherClient } from "@/lib/pusher/client";
import { useEffect, useRef, useState } from "react";

export type Message = {
  id: string;
  content: string | null;
  file: string | null;
  updatedAt: Date;
  senderId: string | null;
};

type Props = {
  initialMessages: Message[];
  conversationId: string;
};

export default function MessagesList({
  initialMessages,
  conversationId,
}: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    scrollToBottom();

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    };

    pusherClient.bind("messages:new", handleNewMessage);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", handleNewMessage);
    };
  }, [conversationId]);

  return (
    <div className="h-full">
      <div className="flex flex-col"></div>
      <div className="pt-24"></div>
    </div>
  );
}
