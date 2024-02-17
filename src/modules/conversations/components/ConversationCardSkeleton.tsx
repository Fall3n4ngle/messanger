import { Skeleton } from "@/ui";

export default function ConversationCardSkeleton() {
  return (
    <div className="relative flex items-center justify-between gap-3 p-2">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="grow">
        <Skeleton className="mb-2.5 h-2.5 w-14 rounded-md" />
        <Skeleton className="h-2 w-12 rounded-md" />
      </div>
      <Skeleton className="absolute right-2 top-[15px] h-2 w-6 rounded-md" />
    </div>
  );
}
