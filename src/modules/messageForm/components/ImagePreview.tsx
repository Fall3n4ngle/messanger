import { ToastMessage, UploadImage } from "@/components";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { useMessageForm } from "@/common/store";
import { useMutation } from "@tanstack/react-query";
import { deleteFiles } from "@/common/actions/files";
import { useToast } from "@/common/hooks";

export default function ImagePreview() {
  const { toast } = useToast();
  const { messageData } = useMessageForm();
  const { setValue, watch } = useFormContext();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteFiles,
    onMutate: () => {
      setValue("file", "");
    },
    onError: () => {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to delete file" />
        ),
      });
    },
  });

  const { fileKey, isEditing: isUpdating } = messageData;

  const handleDelete = () => {
    if (isUpdating || !fileKey) {
      setValue("file", "");
      return;
    }

    mutate(fileKey);
  };

  const url = watch("file");

  if (!url) return null;

  return (
    <UploadImage
      isPending={isPending}
      onDelete={handleDelete}
      className="mb-5 ml-[52px] h-28 w-28"
    >
      <div className="relative h-full w-full ">
        <Image
          src={url}
          alt="Attached image"
          fill
          className="rounded-md object-cover"
        />
      </div>
    </UploadImage>
  );
}
