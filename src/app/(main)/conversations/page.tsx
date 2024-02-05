import { EmptyConversationMessage } from "@/components";

export default async function Conversations() {
  return (
    <div className="hidden md:flex px-4 items-center justify-center min-h-screen w-full">
      <EmptyConversationMessage />
    </div>
  );
}
