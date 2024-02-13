import { SignIn } from "@clerk/nextjs";
import TestUsers from "./components/TestUsers";

export default function Page() {
  return (
    <>
      <div className="mb-6 max-w-[370px] w-full">
        <TestUsers />
      </div>
      <SignIn />
    </>
  );
}
