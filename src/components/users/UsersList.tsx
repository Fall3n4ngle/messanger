"use client";

import { Fragment, useEffect } from "react";
import { ScrollArea } from "../ui";
import { useInView } from "react-intersection-observer";
import { useAuth } from "@clerk/nextjs";
import { useActiveUsers } from "@/store";
import { useInfiniteUsers } from "./lib/hooks/useInfiniteUsers";
import { User } from "./lib/types";
import UserCardSkeleton from "./UserCardSkeleton";
import { UserCardWithDialog } from "./UserCardWithDialog";

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
            {group.map(({ id: userId, clerkId, ...props }) => {
              const isActive = usersIds.includes(clerkId);

              return (
                <li key={userId}>
                  <UserCardWithDialog
                    userId={userId}
                    isActive={isActive}
                    {...props}
                  />
                </li>
              );
            })}
          </Fragment>
        ))}
      </ul>
      {isFetchingNextPage && <UserCardSkeleton />}
      <div ref={bottomRef} className="pt-4" />
    </ScrollArea>
  );
}
