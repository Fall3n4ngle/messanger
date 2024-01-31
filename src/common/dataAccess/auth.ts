import "server-only";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const checkAuth = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
};

export const getUserAuth = async () => {
  const authData = auth();
  if (!authData || !authData.userId) redirect("/sign-in");
  return authData;
};
