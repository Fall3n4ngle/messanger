import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { PropsWithChildren } from "react";

type Props = {
  onDelete: () => void;
  isPending: boolean;
  className?: string;
} & PropsWithChildren;

export default function UploadImage({
  isPending,
  onDelete,
  className,
  children,
}: Props) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <button
        type="button"
        onClick={onDelete}
        className="absolute right-0 top-0 rounded-full p-1 bg-destructive"
        disabled={isPending}
      >
        <X className="text-text-light" size={17} />
      </button>
    </div>
  );
}
