import { SignIn } from "@clerk/nextjs";
import TestUsers from "./components/TestUsers";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <div className="mb-6 w-full max-w-[370px]">
        <TestUsers />
      </div>
      <Suspense fallback={"loading"}>
        <SignIn />
      </Suspense>
    </>
  );
}
