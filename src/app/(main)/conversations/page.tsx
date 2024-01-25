import { EmptyConversationMessage } from "@/components";

export default async function Conversations() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <EmptyConversationMessage />
    </div>
  );
}
