import { cn } from "@/common/utils";
import { Loader2, X } from "lucide-react";
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
        className="absolute right-0 top-0 rounded-full bg-destructive p-1"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 size={17} className="animate-spin" />
        ) : (
          <X size={17} className="text-[#f8fafc]" />
        )}
      </button>
    </div>
  );
}
