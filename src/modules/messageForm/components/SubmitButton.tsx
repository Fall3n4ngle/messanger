import { Button } from "@/ui";
import { Check, Loader2, SendHorizontal } from "lucide-react";

type Props = {
  isSubmitting: boolean;
  isEditing: boolean;
  isUploading: boolean;
};

export default function SubmitButton({
  isSubmitting,
  isEditing,
  isUploading,
}: Props) {
  const disabled = isSubmitting || isUploading;

  let icon;
  if (isSubmitting) {
    icon = <Loader2 className="h-4 w-4 animate-spin" />;
  } else if (isEditing) {
    icon = <Check />;
  } else {
    icon = <SendHorizontal />;
  }

  return (
    <Button
      size="icon"
      className="rounded-full"
      aria-label="Send message"
      disabled={disabled}
    >
      {icon}
    </Button>
  );
}
