import { Navigation } from "@/modules/navigation";
import { getUser } from "@/common/actions/user/queries";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import {
  ActiveStatus,
  PusherConversations,
  PusherMember,
  PusherMessages,
} from "./components";

export default async function layout({ children }: PropsWithChildren) {
  const currentUser = await getUser();
  if (!currentUser) redirect("/onboarding");

  return (
    <div className="flex h-screen">
      <Navigation {...currentUser} />
      <ActiveStatus />
      <PusherMember />
      <PusherConversations />
      <PusherMessages />
      {children}
    </div>
  );
}
