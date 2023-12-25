"use client";

import { Fragment, useEffect } from "react";
import { UserCard } from "../common";
import { ScrollArea } from "../ui";
import { useInView } from "react-intersection-observer";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useActiveUsers } from "@/store";
import { useInfiniteUsers } from "./lib/hooks/useInfiniteUsers";

type User = {
  id: string;
  name: string;
  clerkId: string;
  image: string | null;
};

type Props = {
  initialUsers: User[];
  query?: string;
};

export default function UsersList({ initialUsers, query }: Props) {
  const { userId } = useAuth();
  const { usersIds } = useActiveUsers();

  const { ref: bottomRef, inView } = useInView({
    threshold: 1,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteUsers({
      userId: userId!,
      initialUsers,
      query,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (!data.pages[0].length) {
    return <p className="ml-3">No users found</p>;
  }

  return (
    <ScrollArea>
      <ul className="flex flex-col gap-2" ref={bottomRef}>
        {data.pages.map((group, id) => (
          <Fragment key={id}>
            {group.map(({ id, clerkId, ...props }) => {
              const isActive = usersIds.includes(clerkId);

              return <UserCard key={id} isActive={isActive} {...props} />;
            })}
          </Fragment>
        ))}
      </ul>
      {isFetchingNextPage && (
        <div className="flex w-full justify-center mt-4">
          <Loader2 className="animate-spin text-secondary-foreground" />
        </div>
      )}
      <div ref={bottomRef} className="pt-4" />
    </ScrollArea>
  );
}
