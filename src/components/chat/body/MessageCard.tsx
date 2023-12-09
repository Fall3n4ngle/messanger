import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { Message } from "./MessagesList";
import { useAuth } from "@clerk/nextjs";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";

export default function MessageCard({
  id,
  content,
  file,
  updatedAt,
  sentBy,
}: Message) {
  const { userId } = useAuth();

  if (!sentBy) return null;
  const { clerkId, image, name } = sentBy;

  const isOwn = clerkId === userId;

  return (
    <div className={cn("flex gap-3", isOwn && "justify-end")}>
      <Avatar className={cn("order-1", isOwn && "order-2")}>
        {image && (
          <AvatarImage src={image} alt={name} className="object-cover" />
        )}
        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "mt-2 max-w-[450px] flex flex-col gap-2 order-2",
          isOwn && "order-1"
        )}
      >
        <div className={cn("flex gap-2", isOwn && "justify-end")}>
          <span className=" font-semibold text-foreground/[85%]">{name}</span>
          <span className="text-sm mt-[3px] text-muted-foreground">
            {formatDate(updatedAt)}
          </span>
        </div>
        {file && (
          <div className="relative w-44 pt-[92%] mb-2 self-end">
            <Image
              src={file}
              alt="Attached image"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        )}
        <p
          className={cn(
            "p-2.5 rounded-2xl bg-secondary tracking-tight max-w-[max-content] min-w-[50px]",
            isOwn && "bg-primary text-primary-foreground self-end"
          )}
        >
          {content}
        </p>
      </div>
    </div>
  );
}
