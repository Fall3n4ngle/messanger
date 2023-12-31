import { cn } from "@/lib/utils";
import { Loader, X } from "lucide-react";
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
        {isPending ? (
          <Loader size={17} className="animate-spin" />
        ) : (
          <X size={17} />
        )}
      </button>
    </div>
  );
}
