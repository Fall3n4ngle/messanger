import { PropsWithChildren } from "react";
import {
  ConversationsHeader,
  ConversationsList,
} from "@/components/conversations";
import { getUserConversations } from "@/lib/actions/conversation/queries";
import { getUserByClerkId } from "@/lib/actions/user/queries";
import { getUserAuth } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function layout({ children }: PropsWithChildren) {
  const { session } = await getUserAuth();
  if (!session) redirect("/sign-in");

  const currentUser = await getUserByClerkId(session.user.id);
  if (!currentUser) redirect("/onboarding");

  const userConversations = await getUserConversations({
    currentUserId: currentUser.id,
  });

  return (
    <>
      <div className="border-r max-w-[320px] w-full flex flex-col gap-2.5">
        <ConversationsHeader />
        <ConversationsList intialConversations={userConversations} />
      </div>
      {children}
    </>
  );
}
