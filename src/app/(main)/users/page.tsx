import { Search, EmptyConversationMessage } from "@/components/common";
import { UsersList } from "@/components/users";
import { getUsers } from "@/lib/actions/user/queries";
import { getUserAuth } from "@/lib/utils";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    query?: string;
  };
};

export default async function Users({ searchParams: { query } }: Props) {
  const { session } = await getUserAuth();
  if (!session) redirect("/sign-in");

  const users = await getUsers({ query, currentUserClerkId: session.user.id });

  return (
    <>
      <div className="p-4 border-r max-w-[320px] w-full flex flex-col gap-6">
        <Search id="searchUsers" label="Search users" />
        <UsersList initialUsers={users} query={query} />
      </div>
      <div className="flex items-center justify-center w-full min-h-screen">
        <EmptyConversationMessage />
      </div>
    </>
  );
}
