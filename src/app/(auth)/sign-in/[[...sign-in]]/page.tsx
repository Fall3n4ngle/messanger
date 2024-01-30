import { SignIn } from "@clerk/nextjs";
import TestUsers from "./components/TestUsers";

export default function Page() {
  return (
    <div className="py-12">
      <TestUsers />
      <SignIn />
    </div>
  );
}
