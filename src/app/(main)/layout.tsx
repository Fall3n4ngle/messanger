import { Navigation } from "@/modules/navigation";
import { getUserByClerkId } from "@/common/actions/user/queries";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { ActiveStatus } from "@/components";
import { getUserAuth } from "@/common/dataAccess";

export default async function layout({ children }: PropsWithChildren) {
  const { userId } = await getUserAuth();

  const currentUser = await getUserByClerkId(userId);
  if (!currentUser) redirect("/onboarding");

  return (
    <>
      <Navigation {...currentUser} />
      <ActiveStatus />
      {children}
    </>
  );
}

