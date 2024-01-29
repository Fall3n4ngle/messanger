import { useState } from "react";
import { useToast } from ".";
import { ToastMessage } from "@/components";
import { useDeleteFiles } from "./useDeleteFiles";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { UploadFileResponse } from "uploadthing/client";

type Props = {
  setValue: UseFormSetValue<{ image: string } | { file: string }>;
  isUpdating: boolean;
};

export const useUpload = ({ setValue, isUpdating }: Props) => {
  const { toast } = useToast();
  const { mutate: deleteFiles } = useDeleteFiles({ setValue });
  const [isUploading, setIsUploading] = useState(false);
  const [fileKey, setFileKey] = useState<string | null>(null);

  const handleUploadBegin = () => {
    setIsUploading(true);
  };

  const handleUploadComplete = (
    res: UploadFileResponse<{
      uploadedBy: null;
    }>[]
  ) => {
    const { key, url } = res[0];
    setFileKey(key);
    setValue("image", url);
    setIsUploading(false);
  };

  const handleUploadError = () => {
    toast({
      description: (
        <ToastMessage type="error" message="Failed to upload file" />
      ),
    });

    setIsUploading(false);
  };

  const handleDelete = () => {
    if (fileKey && !isUpdating) {
      deleteFiles(fileKey);
      return;
    }

    setValue("image", "");
  };

  return {
    isUploading,
    handleUploadBegin,
    handleUploadComplete,
    handleUploadError,
    handleDelete,
  };
};
