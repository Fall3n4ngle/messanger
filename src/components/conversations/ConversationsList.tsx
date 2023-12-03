import { ScrollArea } from "../ui";
import { formatDate } from "@/lib/utils";
import ConversationCard from "./ConversationCard";
import Link from "next/link";

type Conversation = {
  id: string;
  name: string;
  image: string | null;
  lastMessageAt: Date;
};

type Props = {
  conversations: Conversation[];
};

export default function ConversationsList({ conversations }: Props) {
  return (
    <ScrollArea>
      {conversations.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {conversations.map(({ id, lastMessageAt, ...props }) => {
            const date = formatDate(lastMessageAt);

            return (
              <li key={id}>
                <Link href={`/conversations/${id}`}>
                  <ConversationCard {...props} lastMessageAt={date} />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-muted-foreground">No conversations yet</p>
      )}
    </ScrollArea>
  );
}
