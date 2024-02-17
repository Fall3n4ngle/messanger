import { EmptyConversationMessage } from "@/components";

export default async function Conversations() {
  return (
    <div className="hidden min-h-screen w-full items-center justify-center px-4 md:flex">
      <EmptyConversationMessage />
    </div>
  );
}
