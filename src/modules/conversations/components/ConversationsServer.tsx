import { getUserConversations } from "@/common/actions/conversation/queries";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ConversationsClient from "./ConversationsClient";
import { PER_PAGE } from "../const";

export default async function ConversationsServer() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["conversations", "list", null],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getUserConversations({
        query: null,
        lastCursor: pageParam,
        take: PER_PAGE
      }),
    initialPageParam: undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConversationsClient />
    </HydrationBoundary>
  );
}
