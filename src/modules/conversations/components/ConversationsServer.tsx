import { getUserConversations } from "@/common/actions/conversation/queries";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ConversationsClient from "./ConversationsClient";
import { CONVERSATIONS_PER_PAGE } from "../const";
import { conversationKeys } from "@/common/const";

export default async function ConversationsServer() {
  const queryClient = new QueryClient();

  await queryClient.fetchInfiniteQuery({
    queryKey: conversationKeys.lists(),
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getUserConversations({
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
