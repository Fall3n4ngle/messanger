import { PropsWithChildren } from "react";
import { Conversations } from "@/modules/conversations";
import { getUserConversations } from "@/common/actions/conversation/queries";
import { getUserByClerkId } from "@/common/actions/user/queries";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { Search } from "@/components";
import { CreateConversationButton } from "@/modules/createConversation";

export default async function layout({ children }: PropsWithChildren) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const currentUser = await getUserByClerkId(userId);
  if (!currentUser) redirect("/onboarding");

  const userConversations = await getUserConversations({
    userId: currentUser.id,
  });

  return (
    <>
      <div className="border-r max-w-[320px] w-full flex flex-col">
        <div className="flex items-center gap-3 p-4">
          <div className="grow">
            <Search label="Search conversations" id="searchConversations" />
          </div>
          <CreateConversationButton />
        </div>
        <Conversations
          intialConversations={userConversations}
          currentUserId={currentUser.id}
        />
      </div>
      {children}
    </>
  );
}
