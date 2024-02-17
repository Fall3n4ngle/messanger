import { PropsWithChildren, Suspense } from "react";
import ConversationsClient from "./components/ConversationsClient";
import { Metadata } from "next";
import { ScrollArea } from "@/ui";
import { Conversations } from "@/modules/conversations";
import ConversationsSkeleton from "./components/ConversationsSkeleton";

export default async function layout({ children }: PropsWithChildren) {
  return (
    <>
      <ConversationsClient>
        <ScrollArea className="mx-auto w-full max-w-[450px] px-4 pb-10 sm:pb-0 md:mx-0">
          <Suspense fallback={<ConversationsSkeleton />}>
            <Conversations />
          </Suspense>
        </ScrollArea>
      </ConversationsClient>
      {children}
    </>
  );
}

export const metadata: Metadata = {
  title: "Conversations",
  description: "A list of user's conversations",
};
