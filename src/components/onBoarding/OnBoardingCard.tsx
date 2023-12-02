import { PropsWithChildren } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui";

export default async function OnBoardingCard({ children }: PropsWithChildren) {
  return (
    <Card className="max-w-[450px] w-full">
      <CardHeader>
        <CardTitle>OnBoarding</CardTitle>
        <CardDescription>
          Complete information about your account
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
