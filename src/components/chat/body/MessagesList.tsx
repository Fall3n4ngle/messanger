"use client";

import { pusherClient } from "@/lib/pusher/client";
import { useEffect, useRef, useState } from "react";
import MessageCard from "./MessageCard";

export type Message = {
  id: string;
  content: string | null;
  file: string | null;
  updatedAt: Date;
  sentBy: {
    image: string | null;
    name: string;
    clerkId: string;
  } | null;
};

type Props = {
  initialMessages: Message[];
  conversationId: string;
};

export default function MessagesList({
  initialMessages = [],
  conversationId,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    scrollToBottom();

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prevMsg) => [...prevMsg, newMessage]);
    };

    pusherClient.bind("messages:new", handleNewMessage);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", handleNewMessage);
    };
  }, [conversationId]);

  return messages.length > 0 ? (
    <>
      <div className="flex flex-col gap-6 justify-end px-6 py-4">
        {messages.map((message) => (
          <MessageCard key={message.id} {...message} />
        ))}
      </div>
      <div ref={bottomRef} />
    </>
  ) : (
    <div className="px-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        No messages yet
      </h3>
    </div>
  );
}
