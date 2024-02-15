import { getUsers } from "@/common/actions/user/queries";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import UsersClient from "./UsersClient";
import { USERS_PER_PAGE } from "../const";
import { userKeys } from "@/common/const";

type Props = {
  searchParams: {
    query?: string;
  };
};

export default async function UsersServer({ searchParams }: Props) {
  const queryClient = new QueryClient();
  const query = searchParams.query ?? "";

  await queryClient.fetchInfiniteQuery({
    queryKey: userKeys.list(query),
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getUsers({
        query,
        lastCursor: pageParam,
        take: USERS_PER_PAGE,
      }),
    initialPageParam: undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersClient />
    </HydrationBoundary>
  );
}
