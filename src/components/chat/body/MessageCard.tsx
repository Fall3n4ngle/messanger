import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { Message } from "./MessagesList";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";

type Props = {
  isOwn: boolean;
  isActive: boolean;
} & Required<Message>;

export default function MessageCard({
  id,
  content,
  file,
  updatedAt,
  sentBy,
  isOwn,
  isActive,
}: Props) {
  const { image, name } = sentBy!;

  return (
    <div className={cn("flex gap-3", isOwn && "justify-end")}>
      <div className={cn("order-1 relative", isOwn && "order-2")}>
        <Avatar>
          {image && (
            <AvatarImage src={image} alt={name} className="object-cover" />
          )}
          <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-muted-foreground border-2 border-background",
            isActive && "bg-green-400"
          )}
        />
      </div>
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
