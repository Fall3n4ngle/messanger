import { checkAuth } from "@/common/dataAccess";
import { SignOutButton } from "@clerk/nextjs";

export default async function Home() {
  await checkAuth();

  return (
    <main>
      <SignOutButton />
    </main>
  );
}
