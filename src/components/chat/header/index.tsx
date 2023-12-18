import ChatSheetButton from "./ChatSheetButton";
import ConversationHeading from "./ConversationHeading";
import MediaRoomButton from "./MediaRoomButton";

export type Member = {
  id: string;
  name: string;
  image: string | null;
  clerkId: string;
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
        <div className="flex items-center gap-1">
          <MediaRoomButton conversationId={conversationId} />
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
