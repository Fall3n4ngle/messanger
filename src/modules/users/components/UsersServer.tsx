import { getUsers } from "@/common/actions/user/queries";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import UsersClient from "./UsersClient";
import { PER_PAGE } from "../const";

type Props = {
  searchParams: {
    query?: string;
  };
};

export default async function UsersServer({ searchParams }: Props) {
  const queryClient = new QueryClient();

  await queryClient.fetchInfiniteQuery({
    queryKey: ["users", searchParams.query ?? null],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getUsers({
        query: null,
        lastCursor: pageParam,
        take: PER_PAGE,
      }),
    initialPageParam: undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersClient />
    </HydrationBoundary>
  );
}
