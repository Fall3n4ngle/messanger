import { usePathname } from "next/navigation";
import { formatDate } from "@/common/utils";
import { getLastMessageData } from "../utils/getLastMessage";
import Link from "next/link";
import ConversationCard from "./ConversationCard";
import { useAuth } from "@clerk/nextjs";
import { UserConversation } from "@/common/actions/conversation/queries";
import { InfiniteData } from "@tanstack/react-query";

type Props = {
  data: InfiniteData<UserConversation[]>;
};

export default function ConversationsList({ data }: Props) {
  const pathname = usePathname();
  const { userId } = useAuth();

  if (!userId) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-3">
      {data.pages.map((group) =>
        group.map(
          ({
            id,
            lastMessage,
            messages: unreadMessages,
            updatedAt,
            ...props
          }) => {
            const date = formatDate(lastMessage?.updatedAt ?? updatedAt);
            const isActive = pathname.includes(id);
            const unreadMessagesCount = unreadMessages?.length;
            const { message, seen } = getLastMessageData({
              currentUserClerkId: userId,
              lastMessage,
            });

            return (
              <li key={id}>
                <Link href={`/conversations/${id}`}>
                  <ConversationCard
                    isActive={isActive}
                    lastMessageAt={date}
                    lastMessageContent={message}
                    unreadMessagesCount={unreadMessagesCount}
                    seen={seen}
                    {...props}
                  />
                </Link>
              </li>
            );
          }
        )
      )}
    </ul>
  );
}
