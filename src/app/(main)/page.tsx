import { checkAuth } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";

export default async function Home() {
  await checkAuth();

  return <main><SignOutButton/></main>;
}
