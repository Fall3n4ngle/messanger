import { Search } from "../common";
import ConversationButton from "./ConversationButton";

export default function ConversationsHeader() {
  return (
    <div className="flex items-center gap-3">
      <Search id="searchConversations" label="Search conversations" />
      <ConversationButton />
    </div>
  );
}
