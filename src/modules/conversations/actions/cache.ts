"use server";

import { checkAuth } from "@/common/dataAccess";
import { revalidatePath } from "next/cache";

export const revalidatePathFromClient = async (path: string) => {
  await checkAuth();
  revalidatePath(path);
};
