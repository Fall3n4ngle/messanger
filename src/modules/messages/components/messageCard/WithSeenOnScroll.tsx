"use client";

import { PropsWithChildren, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useMarkAsSeen } from "../../hooks/useMarkAsSeen";

type Props = {
  messageId: string;
  userId: string;
  conversationId: string;
} & PropsWithChildren;

export default function WithSeenOnScroll({
  userId,
  messageId,
  children,
  conversationId,
}: Props) {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const { mutate } = useMarkAsSeen();

  useEffect(() => {
    if (inView) {
      mutate({
        userId,
        conversationId,
        messageId,
      });
    }
  }, [inView, userId, messageId, conversationId, mutate]);

  return <div ref={ref}>{children}</div>;
}
