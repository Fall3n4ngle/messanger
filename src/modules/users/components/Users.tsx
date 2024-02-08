"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useAuth } from "@clerk/nextjs";
import { useInfiniteUsers } from "../hooks/useInfiniteUsers";
import UserCardSkeleton from "./UserCardSkeleton";
import UsersList from "./UsersList";
import { useToast } from "@/common/hooks";
import { ToastMessage } from "@/components";
import { useSearchParams } from "next/navigation";

export default function Users() {
  const { userId } = useAuth();
  const { toast } = useToast();
  const query = useSearchParams().get("query");

  const { ref: bottomRef, inView } = useInView({
    threshold: 1,
  });

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteUsers({
      userId,
      query,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (error) {
    toast({
      description: <ToastMessage type="error" message="Failed to load users" />,
    });

    return null;
  }

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
