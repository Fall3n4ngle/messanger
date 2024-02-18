import { UserForm } from "@/components";
import { getUser } from "@/common/actions/user/queries";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui";
import { currentUser } from "@clerk/nextjs";

export default async function page() {
  const existingUser = await getUser();
  if (existingUser) redirect("/");

  const user = await currentUser();

  return (
    <Card className="w-full max-w-[450px]">
      <CardHeader>
        <CardTitle>OnBoarding</CardTitle>
        <CardDescription>
          Complete information about your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserForm
          name={user?.username ?? ""}
          successMessage="Profile created successfully"
        />
      </CardContent>
    </Card>
  );
}
