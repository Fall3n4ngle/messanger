import { UserForm } from "@/components";
import { getUserByClerkId } from "@/common/actions/user/queries";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui";
import { auth, currentUser } from "@clerk/nextjs";

export default async function page() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId) redirect("/sign-in");

  const existingUser = await getUserByClerkId(userId);
  if (existingUser) redirect("/");

  return (
    <Card className="max-w-[450px] w-full">
      <CardHeader>
        <CardTitle>OnBoarding</CardTitle>
        <CardDescription>
          Complete information about your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserForm
          clerkId={userId}
          name={user?.username ?? ""}
          successMessage="Profile created successfully"
        />
      </CardContent>
    </Card>
  );
}
