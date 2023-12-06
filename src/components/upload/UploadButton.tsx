"use client";

import { ChangeEvent, ReactNode } from "react";
import {
  UploadFileResponse,
  generateMimeTypes,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

type Props = {
  onClientUploadComplete?:
    | ((
        res: UploadFileResponse<{
          uploadedBy: null;
        }>[]
      ) => void)
    | undefined;
  className?: string;
  renderChildren: ({ isUploading }: { isUploading: boolean }) => ReactNode;
  onUploadError?: ((e: Error) => void) | undefined;
  onUploadBegin?: ((fileName: string) => void) | undefined
};

export default function UploadButton({
  className,
  onClientUploadComplete,
  renderChildren,
  onUploadError,
  onUploadBegin
}: Props) {
  const { startUpload, isUploading, permittedFileInfo } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete,
      onUploadError,
      onUploadBegin
    }
  );

  const { fileTypes, multiple } = generatePermittedFileTypes(
    permittedFileInfo?.config
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    startUpload(Array.from(e.target.files));
  };

  return (
    <label
      className={cn(
        buttonVariants({
          size: "icon",
          variant: "secondary",
        }),
        "cursor-pointer",
        className
      )}
    >
      <input
        type="file"
        onChange={handleChange}
        className="hidden"
        accept={generateMimeTypes(fileTypes ?? [])?.join(", ")}
        multiple={multiple}
      />
      {renderChildren({ isUploading })}
    </label>
  );
}
