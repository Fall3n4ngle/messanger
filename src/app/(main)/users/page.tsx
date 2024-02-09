import { EmptyConversationMessage, Search } from "@/components";
import UsersServer from "@/modules/users/components/UsersServer";
import { Suspense } from "react";
import UsersSkeleton from "./components/UsersSkeleton";
import { ScrollArea } from "@/ui";

type Props = {
  searchParams: {
    query?: string;
  };
};

export default async function UsersPage({ searchParams }: Props) {
  return (
    <>
      <div className="p-4 md:border-r md:max-w-[320px] w-full flex flex-col gap-6">
        <div className="min-w-[270px] max-w-[450px] w-full mx-auto md:mx-0">
          <Search id="searchUsers" label="Search users" />
        </div>
        <Suspense fallback={<UsersSkeleton />}>
          <ScrollArea className="max-w-[450px] w-full mx-auto md:mx-0 pb-10 sm:pb-0">
            <UsersServer searchParams={searchParams} />
          </ScrollArea>
        </Suspense>
      </div>
      <main className="hidden md:flex px-4 items-center justify-center w-full min-h-screen ">
        <EmptyConversationMessage />
      </main>
    </>
  );
}
