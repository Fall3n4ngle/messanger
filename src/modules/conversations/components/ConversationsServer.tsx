import { getUserConversations } from "@/common/actions/conversation/queries";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ConversationsClient from "./ConversationsClient";
import { CONVERSATIONS_PER_PAGE } from "../const";

export default async function ConversationsServer() {
  const queryClient = new QueryClient();

  await queryClient.fetchInfiniteQuery({
    queryKey: ["conversations", "list", null],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getUserConversations({
        query: null,
        lastCursor: pageParam,
        take: CONVERSATIONS_PER_PAGE,
      }),
    initialPageParam: undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConversationsClient />
    </HydrationBoundary>
  );
}
