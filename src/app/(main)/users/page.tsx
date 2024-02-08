import { getUsers } from "@/common/actions/user/queries";
import { getUserAuth } from "@/common/dataAccess";
import { Search } from "@/components";
import { Users } from "@/modules/users";
import { ScrollArea } from "@/ui";
import { EmptyConversationMessage } from "@/components";
import { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

type Props = {
  searchParams: {
    query?: string;
  };
};

export default async function UsersPage({ searchParams }: Props) {
  const { userId } = await getUserAuth();
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["users", searchParams.query ?? null],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getUsers({
        currentUserClerkId: userId,
        query: null,
        lastCursor: pageParam,
      }),
    initialPageParam: undefined,
  });

  return (
    <>
      <div className="p-4 md:border-r md:max-w-[320px] w-full flex flex-col gap-6">
        <div className="min-w-[270px] max-w-[450px] w-full mx-auto md:mx-0">
          <Search id="searchUsers" label="Search users" />
        </div>
        <ScrollArea className="max-w-[450px] w-full mx-auto md:mx-0 pb-10 sm:pb-0">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Users />
          </HydrationBoundary>
        </ScrollArea>
      </div>
      <main className="hidden md:flex px-4 items-center justify-center w-full min-h-screen ">
        <EmptyConversationMessage />
      </main>
    </>
  );
}

export const metadata: Metadata = {
  title: "Users",
  description: "A list of users registered in app",
};
