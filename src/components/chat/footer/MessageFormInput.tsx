import { inputClassName } from "@/components/ui";
import {
  addTypingUser,
  removeTypingUser,
} from "@/lib/actions/typingUser/mutations";
import { useDebouncedCallback, useThrottledCallback } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

type Props = {
  conversationId: string;
  userName: string;
} & ControllerRenderProps;

export default function MessageFormInput({
  conversationId,
  userName,
  ...field
}: Props) {
  const handleTypeStart = useThrottledCallback(async () => {
    await addTypingUser({
      conversationId,
      userName,
    });
  }, 200);

  const handleTypeEnd = useDebouncedCallback(async () => {
    await removeTypingUser({
      conversationId,
      userName,
    });
  }, 500);

  return (
    <TextareaAutosize
      id="message"
      placeholder="Write a message..."
      className={cn(
        inputClassName,
        "!m-0 resize-none bg-secondary dark:bg-secondary/50 border-none"
      )}
      onKeyDown={() => {
        handleTypeStart();
        handleTypeEnd();
      }}
      {...field}
    />
  );
}
