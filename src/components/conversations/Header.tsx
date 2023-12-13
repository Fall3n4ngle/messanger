import GroupButton from "./GroupButton";

export default function ConversationsHeader() {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="grow">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Conversations
        </h4>
      </div>
      <GroupButton />
    </div>
  );
}
