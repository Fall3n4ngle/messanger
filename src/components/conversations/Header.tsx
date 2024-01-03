import { Search } from "../common";
import { CreateGroupButton } from "./CreateGroupForm";

export default function ConversationsHeader() {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="grow">
        <Search label="Search conversations" />
      </div>
      <CreateGroupButton />
    </div>
  );
}
