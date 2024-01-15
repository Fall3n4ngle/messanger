import { inputClassName } from "@/components/ui";
import {
  addTypingUser,
  removeTypingUser,
} from "@/lib/actions/typingUser/mutations";
import { useDebouncedCallback, useThrottledCallback } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { KeyboardEvent } from "react";
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

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const formEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      e.currentTarget.form?.dispatchEvent(formEvent);

      return;
    }

    handleTypeStart();
    handleTypeEnd();
  };

  return (
    <TextareaAutosize
      id="message"
      placeholder="Write a message..."
      className={cn(
        inputClassName,
        "!m-0 resize-none bg-secondary dark:bg-secondary/50 border-none"
      )}
      onKeyDown={handleKeyDown}
      {...field}
    />
  );
}
