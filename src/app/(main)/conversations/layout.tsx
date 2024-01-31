import { PropsWithChildren } from "react";
import { Conversations } from "@/modules/conversations";
import { getUserConversations } from "@/common/actions/conversation/queries";
import { Search } from "@/components";
import { CreateConversationButton } from "@/modules/createConversation";

export default async function layout({ children }: PropsWithChildren) {
  const userConversations = await getUserConversations({});

  return (
    <>
      <div className="border-r max-w-[320px] w-full flex flex-col">
        <div className="flex items-center gap-3 p-4">
          <div className="grow">
            <Search label="Search conversations" id="searchConversations" />
          </div>
          <CreateConversationButton />
        </div>
        <Conversations intialConversations={userConversations} />
      </div>
      {children}
    </>
  );
}
