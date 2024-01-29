import { useIsUploading } from "@/common/context/isUploading";
import { Button } from "@/ui";
import { Loader2 } from "lucide-react";
import { useFormState } from "react-hook-form";

export default function SubmitButton() {
  const { isSubmitting } = useFormState();
  const { isUploading } = useIsUploading();

  let content;
  if (isSubmitting) {
    content = (
      <>
        Submitting <Loader2 className="ml-2 h-4 w-4 animate-spin" />
      </>
    );
  } else if (isUploading) {
    content = (
      <>
        Uploading <Loader2 className="ml-2 h-4 w-4 animate-spin" />
      </>
    );
  } else {
    content = "Submit";
  }

  return (
    <Button disabled={isSubmitting || isUploading} type="submit">
      {content}
    </Button>
  );
}
