import { pusherClient } from "@/lib/pusher/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Conversation } from "../types";

type UsePusherConversationsProps = {
  currentUserId: string;
  query: string | null;
};

export const usePusherConversations = ({
  currentUserId,
  query,
}: UsePusherConversationsProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    pusherClient.subscribe(currentUserId);

    const handleNewConversation = (newConversation: Conversation) => {
      // const queryCache = queryClient.getQueryCache();
      // queryCache
      //   .findAll({
      //     queryKey: ["conversations"],
      //   })
      //   .forEach(({ queryKey }) => {
      //     queryClient.setQueryData(
      //       queryKey,
      //       ({ pageParams, pages }: InfiniteData<Conversation[], unknown>) => {
      //         return {
      //           pages: pages.map((page, index) =>
      //             index === pages.length - 1 ? [...page, newConversation] : page
      //           ),
      //           pageParams,
      //         };
      //       }
      //     );
      //   });
      queryClient.invalidateQueries({ queryKey: ["conversations", "list"] });
    };

    const handleNewMessage = () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", "list"] });
    };

    pusherClient.bind("group:new", handleNewConversation);
    pusherClient.bind("conversation:new_message", handleNewMessage);

    return () => {
      pusherClient.unsubscribe(currentUserId);
      pusherClient.unbind("conversation:new", handleNewConversation);
      pusherClient.unbind("conversation:new_message", handleNewMessage);
    };
  }, [currentUserId, queryClient, query]);
};
