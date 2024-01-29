import { inputClassName } from "@/ui";
import { addTypingUser, removeTypingUser } from "../actions/user";
import { cn } from "@/common/utils";
import { KeyboardEvent, forwardRef, useEffect, useRef, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

type Props = {
  conversationId: string;
  userName: string;
} & ControllerRenderProps;

const ContentInput = forwardRef<HTMLTextAreaElement, Props>(
  ({ conversationId, userName, ...props }, ref) => {
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        const formEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        });

        e.currentTarget.form?.dispatchEvent(formEvent);

        return;
      }

      if (!isTyping) {
        await addTypingUser({
          conversationId,
          userName,
        });

        setIsTyping(true);
      }
    };

    const handleKeyUp = () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(async () => {
        await removeTypingUser({
          conversationId,
          userName,
        });
        setIsTyping(false);
      }, 500);
    };

    useEffect(() => {
      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }, []);

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
        onKeyUp={handleKeyUp}
      />
    );
  }
);

ContentInput.displayName = "MessageFormInput";

export default ContentInput;
