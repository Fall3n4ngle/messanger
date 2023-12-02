"use server";

import { UTApi } from "uploadthing/server";

export const deleteFiles = async (fileKeys: string | string[]) => {
  try {
    const result = await new UTApi().deleteFiles(fileKeys);

    if (!result.success) {
      throw new Error("Error deleteting files");
    }
  } catch (error) {
    console.log(error);
  }
};
