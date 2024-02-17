import { useToast } from "@/common/hooks";
import { useMessageForm } from "@/common/store";
import { cn } from "@/common/utils";
import { ToastMessage } from "@/components";
import { useUploadThing } from "@/lib/uploadThing/helpers";
import { buttonVariants } from "@/ui";
import { ImageIcon, Loader2 } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import {
  UploadFileResponse,
  generateMimeTypes,
  generatePermittedFileTypes,
} from "uploadthing/client";

type Props = {
  isUploading: boolean;
  isSubmitting: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
};

export default function UploadButton({
  isSubmitting,
  isUploading,
  setIsUploading,
}: Props) {
  const { toast } = useToast();
  const { setMessageData } = useMessageForm();
  const { setValue } = useFormContext();

  const handleUploadBegin = (files: File[]) => {
    setIsUploading(true);
    return files;
  };

  const handleUploadComplete = (
    result: UploadFileResponse<{
      uploadedBy: string;
    }>[],
  ) => {
    const { key, url } = result[0];
    setValue("file", url);
    setMessageData({ fileKey: key });
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

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onBeforeUploadBegin: handleUploadBegin,
    onClientUploadComplete: handleUploadComplete,
    onUploadError: handleUploadError,
  });

  const { fileTypes, multiple } = generatePermittedFileTypes(
    permittedFileInfo?.config,
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    startUpload(Array.from(e.target.files));
  };

  const disabled = isUploading || isSubmitting;

  return (
    <label
      className={cn(
        buttonVariants({
          size: "icon",
          variant: "secondary",
        }),
        "!mt-0 cursor-pointer rounded-full",
        disabled && "cursor-default opacity-50",
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
      {isUploading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <ImageIcon />
      )}
    </label>
  );
}
