import { pusherClient } from "@/lib/pusher/client";
import { useMessage } from "@/store/useMessage";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Message } from "../types";
import { UpdateMessage } from "@/lib/actions/messages/mutations";

export const usePusherMessages = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const queryClient = useQueryClient();
  const { setMessage } = useMessage();

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const handleNewMessage = (newMessage: Message) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        ({ pageParams, pages }: InfiniteData<Message[], unknown>) => {
          return {
            pages: pages.map((page, index) =>
              index === pages.length - 1 ? [...page, newMessage] : page
            ),
            pageParams,
          };
        }
      );
    };

    const handleDeleteMessage = ({ id }: { id: string }) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        (oldData: InfiniteData<Message[], unknown>) => {
          let found = false;

          const newData = {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (found) return page;

              const newPage = page.filter((message) => {
                if (message.id === id) {
                  found = true;
                  return false;
                }

                return true;
              });

              return newPage;
            }),
          };
          return newData;
        }
      );
    };

    const handleUpdateMessage = ({ id, content, file }: UpdateMessage) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        (oldData: InfiniteData<Message[], unknown>) => {
          let found = false;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (found) return page;

              const newPage = page.map((message) => {
                if (message.id === id) {
                  found = true;

                  return {
                    ...message,
                    file,
                    content,
                  } as Message;
                }

                return message;
              });

              return newPage;
            }),
          };
        }
      );

      setMessage({ id: undefined, file: "", content: "" });
    };

    pusherClient.bind("messages:new", handleNewMessage);
    pusherClient.bind("messages:delete", handleDeleteMessage);
    pusherClient.bind("messages:update", handleUpdateMessage);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", handleNewMessage);
      pusherClient.unbind("messages:delete", handleDeleteMessage);
      pusherClient.unbind("messages:update", handleUpdateMessage);
    };
  }, [conversationId, queryClient, setMessage]);
};
