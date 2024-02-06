import { getUsers } from "@/common/actions/user/queries";
import { getUserAuth } from "@/common/dataAccess";
import { Search } from "@/components";
import { Users } from "@/modules/users";
import { ScrollArea } from "@/ui";
import { EmptyConversationMessage } from "@/components";

export default async function UsersPage() {
  const { userId } = await getUserAuth();
  const users = await getUsers({ currentUserClerkId: userId });

  return (
    <>
      <div className="p-4 md:border-r md:max-w-[320px] w-full flex flex-col gap-6">
        <div className="min-w-[270px] max-w-[450px] w-full mx-auto md:mx-0">
          <Search id="searchUsers" label="Search users" />
        </div>
        <ScrollArea className="max-w-[450px] w-full mx-auto md:mx-0 pb-10 sm:pb-0">
          <Users initialUsers={users} />
        </ScrollArea>
      </div>
      <main className="hidden md:flex px-4 items-center justify-center w-full min-h-screen ">
        <EmptyConversationMessage />
      </main>
    </>
  );
}
