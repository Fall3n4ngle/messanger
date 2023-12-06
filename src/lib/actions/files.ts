"use server";

import { UTApi } from "uploadthing/server";

export const deleteFiles = async (fileKeys: string | string[]) => {
  try {
    const result = await new UTApi().deleteFiles(fileKeys);

    if (!result.success) {
      return { success: false, error: "Error deleting file" };
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    const message = (error as Error)?.message ?? "Error deleting file";
    return { success: false, error: message };
  }
};
