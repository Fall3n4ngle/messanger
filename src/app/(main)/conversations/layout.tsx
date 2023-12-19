import { PropsWithChildren } from "react";
import {
  ConversationsHeader,
  ConversationsList,
} from "@/components/conversations";
import { getUserConversations } from "@/lib/actions/conversation/queries";
import { getUserByClerkId } from "@/lib/actions/user/queries";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

export default async function layout({ children }: PropsWithChildren) {
  const { userId } = auth()
  if (!userId) redirect("/sign-in");

  const currentUser = await getUserByClerkId(userId);
  if (!currentUser) redirect("/onboarding");

  const userConversations = await getUserConversations({
    currentUserId: currentUser.id,
  });

  return (
    <>
      <div className="border-r max-w-[320px] w-full flex flex-col gap-2.5">
        <ConversationsHeader />
        <ConversationsList
          intialConversations={userConversations}
          currentUserId={currentUser.id}
        />
      </div>
      {children}
    </>
  );
}
