import { getUserByClerkId } from "@/lib/actions/user/queries";
import { getUserAuth } from "@/lib/utils";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function layout({ children }: PropsWithChildren) {
  const { session } = await getUserAuth();
  if (!session) redirect("/sign-in");

  const currentUser = await getUserByClerkId(session.user.id);
  if (!currentUser) redirect("/onboarding");

  return <div>{children}</div>;
}
