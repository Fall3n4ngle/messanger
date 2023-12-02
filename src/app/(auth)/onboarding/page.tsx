import { UserForm } from "@/components/common";
import OnBoardingCard from "@/components/onBoarding/OnBoardingCard";
import { getUserByClerkId } from "@/lib/actions/user/queries";
import { getUserAuth } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function page() {
  const { session } = await getUserAuth();
  if (!session) redirect("/sign-in");

  const currentUser = await getUserByClerkId(session.user.id);
  if (currentUser) redirect("/");

  return (
    <OnBoardingCard>
      <UserForm clerkId={session.user.id} />
    </OnBoardingCard>
  );
}
