import { Skeleton } from "@/ui";

export default function UserCardSkeleton() {
  return (
    <div className="flex items-center gap-5 cursor-pointer p-2">
      <Skeleton className="w-10 h-10 rounded-full" />
      <Skeleton className="w-28 h-4 rounded-md" />
    </div>
  );
}
