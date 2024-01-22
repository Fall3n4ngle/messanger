"use client";

import { PropsWithChildren, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useMarkAsSeen } from "../lib/hooks/useMarkAsSeen";

type Props = {
  messageId: string;
  memberId: string;
  seen: boolean;
  conversationId: string;
} & PropsWithChildren;

export default function WithSeenOnScroll({
  memberId,
  messageId,
  seen,
  children,
  conversationId,
}: Props) {
  const { ref, inView } = useInView({
    threshold: 1,
  });

  const { mutate } = useMarkAsSeen();

  useEffect(() => {
    if (inView && !seen) {
      mutate({
        memberId,
        conversationId,
        messageId,
      });
    }
  }, [inView, seen, memberId, messageId, conversationId, mutate]);

  return <div ref={ref}>{children}</div>;
}
