"use client";

import { Fragment, useEffect } from "react";
import { UserCard } from "../common";
import { ScrollArea } from "../ui";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/actions/user/queries";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

type User = {
  id: string;
  name: string;
  image: string | null;
};

type Props = {
  initialUsers: User[];
  query?: string;
};

const take = 25;

export default function UsersList({ initialUsers, query }: Props) {
  const { userId } = useAuth();

  const { ref: bottomRef, inView } = useInView({
    threshold: 1,
  });

  const getData = async ({ pageParam }: { pageParam?: string }) => {
    const users = await getUsers({
      currentUserClerkId: userId!,
      lastCursor: pageParam,
      query,
      take,
    });

    return users;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["users", query],
      queryFn: getData,
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => {
        if (lastPage.length < take) {
          return;
        }

        return lastPage[lastPage.length - 1].id;
      },
      initialData: {
        pages: [initialUsers],
        pageParams: [undefined],
      },
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (!data.pages[0].length) {
    return <p className="ml-3">No users found</p>
  }

  return (
    <ScrollArea>
      <ul className="flex flex-col gap-2" ref={bottomRef}>
        {data.pages.map((group, id) => (
          <Fragment key={id}>
            {group.map(({ id, ...props }) => (
              <UserCard key={id} {...props} />
            ))}
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
