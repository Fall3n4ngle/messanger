import { getUsers } from "@/common/actions/user/queries";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import UsersClient from "./UsersClient";

type Props = {
  searchParams: {
    query?: string;
  };
};

export default async function UsersServer({ searchParams }: Props) {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["users", searchParams.query ?? null],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getUsers({
        query: null,
        lastCursor: pageParam,
      }),
    initialPageParam: undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersClient />
    </HydrationBoundary>
  );
}
