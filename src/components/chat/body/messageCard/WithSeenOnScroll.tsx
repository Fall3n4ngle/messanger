"use client";

import { FormMessage } from "@/components/common";
import { markAsSeen } from "@/lib/actions/messages/mutations";
import { useToast } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { ref, inView } = useInView({
    threshold: 1,
  });

  const { previousCache, updateCache } = useMarkAsSeen({
    conversationId,
    messageId,
  });

  useEffect(() => {
    if (inView && !seen) {
      updateCache();

      (async function () {
        const response = await markAsSeen({
          memberId,
          messageId,
          conversationId,
        });

        if (response.error) {
          queryClient.setQueryData(["conversations"], previousCache.current);

          toast({
            description: (
              <FormMessage
                type="error"
                message="Failed to mark message as seen"
              />
            ),
          });
        }
      })();
    }
  }, [
    inView,
    seen,
    memberId,
    messageId,
    conversationId,
    updateCache,
    queryClient,
    toast,
    previousCache,
  ]);

  return <div ref={ref}>{children}</div>;
}
