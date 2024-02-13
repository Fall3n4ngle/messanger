"use server";

import { UTApi } from "uploadthing/server";
import { checkAuth } from "../dataAccess";

export const deleteFiles = async (fileKeys: string) => {
  await checkAuth();

  try {
    const result = await new UTApi().deleteFiles(fileKeys);

    if (!result.success) {
      return { success: false, error: "Error deleting file" };
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    const message = (error as Error)?.message ?? "Error deleting file";
    throw new Error(message);
  }
};
