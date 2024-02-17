import { SignIn } from "@clerk/nextjs";
import TestUsers from "./components/TestUsers";

export default function Page() {
  return (
    <>
      <div className="mb-6 w-full max-w-[370px]">
        <TestUsers />
      </div>
      <SignIn />
    </>
  );
}
