import { getUserConversations } from "@/common/actions/conversation/queries";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ConversationsClient from "./ConversationsClient";

export default async function ConversationsServer() {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: ["conversations", "list", null],
    queryFn: () => getUserConversations({ query: null }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConversationsClient />
    </HydrationBoundary>
  );
}
