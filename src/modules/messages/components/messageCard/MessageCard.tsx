import { Avatar, AvatarFallback, AvatarImage } from "@/ui";
import { cn, formatDate } from "@/common/utils";
import Image from "next/image";
import { ReactNode, forwardRef } from "react";
import { Message } from "@/common/actions/messages/queries";

type MessageCardPorps = {
  isOwn: boolean;
  isActive: boolean;
  seen: ReactNode;
} & Pick<Message, "content" | "file" | "updatedAt" | "user" | "createdAt">;

const MessageCard = forwardRef<HTMLDivElement, MessageCardPorps>(
  (
    {
      content,
      file,
      updatedAt,
      createdAt,
      user,
      isOwn,
      isActive,
      seen,
      ...props
    },
    ref,
  ) => {
    const { image, name } = user;
    const isEdited = updatedAt.toString() !== createdAt.toString();

    return (
      <div
        ref={ref}
        {...props}
        className={cn("flex gap-3", isOwn && "justify-end")}
      >
        <div className={cn("relative order-1", isOwn && "order-2")}>
          <Avatar>
            {image && (
              <AvatarImage src={image} alt={name} className="object-cover" />
            )}
            <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-muted-foreground",
              isActive && "bg-green-400",
            )}
          />
        </div>
        <div
          className={cn(
            "order-2 mt-2 flex max-w-[450px] flex-col gap-2",
            isOwn && "order-1",
          )}
        >
          <div className={cn("flex gap-2", isOwn && "justify-end")}>
            <span className=" font-semibold text-foreground/[85%]">
              {isOwn ? "You" : name}
            </span>
            <span className="mt-[3px] text-sm text-muted-foreground">
              {formatDate(createdAt)}
            </span>
            {isEdited && (
              <span className="mt-[3px] text-sm text-muted-foreground">
                (edited)
              </span>
            )}
            <span className="mt-[4.5px]">{seen}</span>
          </div>
          {file && (
            <div className="relative mb-2 w-44 self-end pt-[92%]">
              <Image
                src={file}
                alt="Attached image"
                fill
                className="rounded-2xl object-cover"
              />
            </div>
          )}
          {content && content.length > 0 && (
            <p
              className={cn(
                "min-w-[50px] max-w-[max-content] rounded-2xl bg-secondary p-2.5 tracking-tight",
                isOwn && "self-end bg-primary text-primary-foreground",
              )}
            >
              {content}
            </p>
          )}
        </div>
      </div>
    );
  },
);

MessageCard.displayName = "MessageCard";

export default MessageCard;
