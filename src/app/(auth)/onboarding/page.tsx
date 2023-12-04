import { UserForm } from "@/components/common";
import { getUserByClerkId } from "@/lib/actions/user/queries";
import { getUserAuth } from "@/lib/utils";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default async function page() {
  const { session } = await getUserAuth();
  if (!session) redirect("/sign-in");

  const currentUser = await getUserByClerkId(session.user.id);
  if (currentUser) redirect("/");

  return (
    <Card className="max-w-[450px] w-full">
      <CardHeader>
        <CardTitle>OnBoarding</CardTitle>
        <CardDescription>
          Complete information about your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserForm clerkId={session.user.id} />
      </CardContent>
    </Card>
  );
}
