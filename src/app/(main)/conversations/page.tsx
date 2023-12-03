import {
  ConversationsHeader,
  ConversationsList,
} from "@/components/conversations";
import { getUserConversations } from "@/lib/actions/conversation/queries";
import { getUserByClerkId } from "@/lib/actions/user/queries";
import { getUserAuth } from "@/lib/utils";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    query?: string;
  };
};

export default async function Conversations({
  searchParams: { query },
}: Props) {
  const { session } = await getUserAuth();
  if (!session) redirect("/sign-in");

  const currentUser = await getUserByClerkId(session.user.id);
  if (!currentUser) redirect("/onboarding");

  const userConversations = await getUserConversations({
    query,
    currentUserId: currentUser.id,
  });

  return (
    <div className="p-4 border-r max-w-[300px] w-full flex flex-col gap-6">
      <ConversationsHeader />
      <ConversationsList conversations={userConversations} />
    </div>
  );
}
