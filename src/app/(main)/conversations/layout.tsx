import { PropsWithChildren } from "react";
import { getUserConversations } from "@/common/actions/conversation/queries";
import ConversationsClient from "./components/ConversationsClient";
import { Metadata } from "next";

export default async function layout({ children }: PropsWithChildren) {
  const userConversations = await getUserConversations({});

  return (
    <>
      <ConversationsClient initialConversations={userConversations} />
      {children}
    </>
  );
}

export const metadata: Metadata = {
  title: "Conversations",
  description: "A list of user's conversations",
};
