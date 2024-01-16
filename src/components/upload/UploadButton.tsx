"use client";

import { ChangeEvent, PropsWithChildren, forwardRef } from "react";
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
  onUploadError?: ((e: Error) => void) | undefined;
  onBeforeUploadBegin?: ((files: File[]) => File[]) | undefined;
  disabled?: boolean;
} & PropsWithChildren;

const UploadButton = forwardRef<HTMLLabelElement, Props>(
  (
    {
      className,
      onClientUploadComplete,
      onUploadError,
      onBeforeUploadBegin,
      children,
      disabled,
    },
    ref
  ) => {
    const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
      onClientUploadComplete,
      onUploadError,
      onBeforeUploadBegin,
    });

    const { fileTypes, multiple } = generatePermittedFileTypes(
      permittedFileInfo?.config
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      startUpload(Array.from(e.target.files));
    };

    return (
      <label
        ref={ref}
        className={cn(
          buttonVariants({
            size: "icon",
            variant: "secondary",
          }),
          "cursor-pointer !mt-0",
          disabled && "cursor-default opacity-50",
          className
        )}
      >
        <input
          type="file"
          onChange={handleChange}
          className="hidden"
          accept={generateMimeTypes(fileTypes ?? [])?.join(", ")}
          multiple={multiple}
          disabled={disabled}
        />
        {children}
      </label>
    );
  }
);

UploadButton.displayName = "UploadButton";

export default UploadButton;
