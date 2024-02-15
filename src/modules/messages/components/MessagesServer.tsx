import { getMessages } from "@/common/actions/messages/queries";
import { messageKeys } from "@/common/const";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import MessagesClient from "./MessagesClient";

type Props = {
  conversationId: string;
};

export default async function MessagesServer({ conversationId }: Props) {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: messageKeys.list(conversationId),
    queryFn: () => getMessages({ conversationId }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MessagesClient />
    </HydrationBoundary>
  );
}
