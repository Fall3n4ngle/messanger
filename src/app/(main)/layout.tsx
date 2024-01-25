import { Navigation } from "@/modules/navigation";
import { getUserByClerkId } from "@/common/actions/user/queries";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { auth } from "@clerk/nextjs";

export default async function layout({ children }: PropsWithChildren) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const currentUser = await getUserByClerkId(userId);
  if (!currentUser) redirect("/onboarding");

  return (
    <>
      <Navigation {...currentUser} />
      {children}
    </>
  );
}
