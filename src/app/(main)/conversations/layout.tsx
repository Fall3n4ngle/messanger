import { PropsWithChildren } from "react";
import { getUserConversations } from "@/common/actions/conversation/queries";
import ConversationsClient from "./components/ConversationsClient";

export default async function layout({ children }: PropsWithChildren) {
  const userConversations = await getUserConversations({});

  return (
    <>
      <ConversationsClient initialConversations={userConversations} />
      {children}
    </>
  );
}
