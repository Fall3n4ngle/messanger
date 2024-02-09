import { Skeleton } from "@/ui";

export default function ConversationCardSkeleton() {
  return (
    <div className="relative flex items-center justify-between gap-3 p-2">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="grow">
        <Skeleton className="h-2.5 w-14 rounded-md mb-2.5" />
        <Skeleton className="h-2 w-12 rounded-md" />
      </div>
      <Skeleton className="absolute top-[15px] right-2 w-6 h-2 rounded-md" />
    </div>
  );
}
