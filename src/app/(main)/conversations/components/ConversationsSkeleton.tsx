import { ConversationCardSkeleton } from "@/modules/conversations";

export default function ConversationsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <ConversationCardSkeleton />
      <ConversationCardSkeleton />
      <ConversationCardSkeleton />
      <ConversationCardSkeleton />
      <ConversationCardSkeleton />
    </div>
  );
}
