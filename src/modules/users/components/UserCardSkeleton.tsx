import { Skeleton } from "@/ui";

export default function UserCardSkeleton() {
  return (
    <div className="flex cursor-pointer items-center gap-5 p-2">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-28 rounded-md" />
    </div>
  );
}
