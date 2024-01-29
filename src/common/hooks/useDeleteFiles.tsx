import { deleteFiles } from "@/common/actions/files";
import { useToast } from "@/common/hooks";
import { ToastMessage } from "@/components";
import { useMutation } from "@tanstack/react-query";
import { FieldValues, UseFormSetValue } from "react-hook-form";

type Props = {
  setValue?: UseFormSetValue<{ image: string } | { file: string }>;
};

export const useDeleteFiles = ({ setValue }: Props) => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteFiles,
    onMutate: () => {
      setValue && setValue("file", "");
    },
    onError: (_, fileKey) => {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to delete file" />
        ),
      });

      setValue && setValue("file", fileKey);
    },
  });
};
