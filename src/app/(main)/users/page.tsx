import { Search, EmptyConversationMessage } from "@/components";
import { Users } from "@/modules/users";
import { getUsers } from "@/common/actions/user/queries";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

type Props = {
  searchParams: {
    query?: string;
  };
};

export default async function UsersPage({ searchParams: { query } }: Props) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const users = await getUsers({ query, currentUserClerkId: userId });

  return (
    <>
      <div className="p-4 border-r max-w-[320px] w-full flex flex-col gap-6">
        <Search id="searchUsers" label="Search users" />
        <Users initialUsers={users} query={query} />
      </div>
      <div className="flex items-center justify-center w-full min-h-screen">
        <EmptyConversationMessage />
      </div>
    </>
  );
}
