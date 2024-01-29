import { useIsUploading } from "@/common/context/isUploading";
import { useMessageForm } from "@/common/store";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui";
import { X } from "lucide-react";

export default function ExitEditingButton() {
  const { resetMessageData } = useMessageForm();
  const { isUploading } = useIsUploading();

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetMessageData}
            className="rounded-full ml-auto mb-5"
            disabled={isUploading}
          >
            <X className="w-4.5 h-4.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Exit editing mode</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
