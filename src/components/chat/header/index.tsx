import ChatSheetButton from "./ChatSheetButton";
import ConversationHeading from "./ConversationHeading";

export type Member = {
  id: string;
  name: string;
  image: string | null;
};

type Props = {
  conversationId: string;
  name: string;
  usersCount: number;
  image: string | null;
  isGroup: boolean;
  members: Member[];
};

export default function ChatHeader({
  conversationId,
  image,
  name,
  usersCount,
  isGroup,
  members,
}: Props) {
  return (
    <div className="py-3 px-6 border-b w-full">
      <div className="flex justify-between items-center">
        <ConversationHeading
          name={name}
          image={image}
          description={isGroup ? `${usersCount} members` : ""}
        />
        <div>
          <ChatSheetButton
            members={members}
            name={name}
            conversationId={conversationId}
          />
        </div>
      </div>
    </div>
  );
}
