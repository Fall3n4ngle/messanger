import { ScrollArea } from "../ui";
import { formatDate } from "@/lib/utils";
import ConversationCard from "./ConversationCard";

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
      <ul className="flex flex-col gap-3">
        {conversations.map(({ id, lastMessageAt, ...props }) => {
          const date = formatDate(lastMessageAt);

          return (
            <li key={id}>
              <ConversationCard {...props} lastMessageAt={date} />
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
