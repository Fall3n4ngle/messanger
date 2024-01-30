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
import { auth } from "@clerk/nextjs";

export default async function page() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const currentUser = await getUserByClerkId(userId);
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
        <UserForm
          clerkId={userId}
          successMessage="Profile created successfully"
          errorMessage="Failed to create acount"
        />
      </CardContent>
    </Card>
  );
}
