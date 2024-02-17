"use client";

import { UploadDropzone } from "@/lib/uploadThing/components";
import UploadImage from "./UploadImage";
import Image from "next/image";
import { deleteFiles as deleteFilesServer } from "@/common/actions/files";
import { UploadFileResponse } from "uploadthing/client";
import { useToast } from "@/common/hooks";
import { Dispatch, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ToastMessage } from ".";

import "@uploadthing/react/styles.css";

type Props = {
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
};

export default function Dropzone({ isUploading, setIsUploading }: Props) {
  const { toast } = useToast();
  const { setValue, watch } = useFormContext();

  const [fileKey, setFileKey] = useState<string | null>(null);

  const { mutate: deleteFiles } = useMutation({
    mutationFn: deleteFilesServer,
    onMutate: () => {
      setValue("image", "");
    },
    onError: (_, fileKey) => {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to delete file" />
        ),
      });

      setValue("image", fileKey);
    },
  });

  const handleUploadBegin = (files: File[]) => {
    setIsUploading(true);
    return files;
  };

  const handleUploadError = () => {
    toast({
      description: (
        <ToastMessage type="error" message="Failed to upload file" />
      ),
    });

    setIsUploading(false);
  };

  const handleUploadComplete = (
    res: UploadFileResponse<{
      uploadedBy: string;
    }>[],
  ) => {
    const { key, url } = res[0];
    setFileKey(key);
    setValue("image", url);
    setIsUploading(false);
  };

  const handleDelete = () => {
    if (!fileKey) {
      setValue("image", "");
      return;
    }

    deleteFiles(fileKey);
  };

  const url = watch("image");

  if (!url) {
    return (
      <UploadDropzone
        endpoint="imageUploader"
        config={{
          mode: "auto",
        }}
        onBeforeUploadBegin={handleUploadBegin}
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
    );
  }

  return (
    <div className="flex items-center justify-center px-6 py-10">
      <UploadImage
        isPending={isUploading}
        onDelete={handleDelete}
        className="mx-auto h-24 w-24"
      >
        <Image
          src={url}
          alt="image"
          fill
          className="rounded-full object-cover"
        />
      </UploadImage>
    </div>
  );
}
