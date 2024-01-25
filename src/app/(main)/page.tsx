import { checkAuth } from "@/common/utils";
import { SignOutButton } from "@clerk/nextjs";

export default async function Home() {
  await checkAuth();

  return (
    <main>
      <SignOutButton />
    </main>
  );
}
