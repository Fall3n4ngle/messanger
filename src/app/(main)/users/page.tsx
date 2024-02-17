import { EmptyConversationMessage, Search } from "@/components";
import { Users } from "@/modules/users";
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
      <div className="flex w-full flex-col gap-6 p-4 md:max-w-[320px] md:border-r">
        <div className="mx-auto w-full min-w-[270px] max-w-[450px] md:mx-0">
          <Search id="searchUsers" label="Search users" />
        </div>
        <Suspense fallback={<UsersSkeleton />}>
          <ScrollArea className="mx-auto w-full max-w-[450px] pb-10 sm:pb-0 md:mx-0">
            <Users searchParams={searchParams} />
          </ScrollArea>
        </Suspense>
      </div>
      <main className="hidden min-h-screen w-full items-center justify-center px-4 md:flex ">
        <EmptyConversationMessage />
      </main>
    </>
  );
}
