import { useIsUploading } from "@/common/context/isUploading";
import { useMessageForm } from "@/common/store";
import { Button } from "@/ui";
import { Check, Loader2, SendHorizontal } from "lucide-react";
import { useFormState } from "react-hook-form";

export default function SubmitButton() {
  const { isUploading } = useIsUploading();
  const { isSubmitting } = useFormState();
  const { messageData } = useMessageForm();

  return (
    <Button
      size="icon"
      className="rounded-full"
      aria-label="Send message"
      disabled={isSubmitting || isUploading}
    >
      {isSubmitting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : messageData.isUpdating ? (
        <Check />
      ) : (
        <SendHorizontal />
      )}
    </Button>
  );
}
