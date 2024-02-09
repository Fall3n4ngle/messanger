import { UserCardSkeleton } from "@/modules/users";

export default function UsersSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <UserCardSkeleton />
      <UserCardSkeleton />
      <UserCardSkeleton />
      <UserCardSkeleton />
      <UserCardSkeleton />
    </div>
  );
}
