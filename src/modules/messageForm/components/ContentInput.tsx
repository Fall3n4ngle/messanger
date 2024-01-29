import { inputClassName } from "@/ui";
import { addTypingUser, removeTypingUser } from "../actions/user";
import { useDebouncedCallback, useThrottledCallback } from "@/common/hooks";
import { cn } from "@/common/utils";
import { KeyboardEvent, forwardRef } from "react";
import { ControllerRenderProps } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

type Props = {
  conversationId: string;
  userName: string;
} & ControllerRenderProps;

const ContentInput = forwardRef<HTMLTextAreaElement, Props>(
  ({ conversationId, userName, ...props }, ref) => {
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
        {...props}
        ref={ref}
        onKeyDown={handleKeyDown}
      />
    );
  }
);

ContentInput.displayName = "MessageFormInput";

export default ContentInput;
