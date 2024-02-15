"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteUsers } from "../hooks/useInfiniteUsers";
import UserCardSkeleton from "./UserCardSkeleton";
import UsersList from "./UsersList";
import { useSearchParams } from "next/navigation";

export default function UsersClient() {
  const query = useSearchParams().get("query") ?? "";

  const { ref: bottomRef, inView } = useInView({
    threshold: 1,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteUsers({
      query,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (!data?.pages[0].length) {
    return <p className="ml-3">No users found</p>;
  }

  return (
    <>
      <UsersList users={data.pages} />
      {isFetchingNextPage && <UserCardSkeleton />}
      <div ref={bottomRef} className="pt-4" />
    </>
  );
}
