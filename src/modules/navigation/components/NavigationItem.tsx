import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  buttonVariants,
} from "@/ui";
import { LucideIcon } from "lucide-react";
import { cn } from "@/common/utils";

type Props = {
  href: string;
  Icon: LucideIcon;
  onClick?: () => void;
  active?: boolean;
  label: string;
};

export default function NavigationItem({
  href,
  Icon,
  label,
  active,
  onClick,
}: Props) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            onClick={onClick}
            className={cn(
              buttonVariants({
                size: "icon",
                variant: active ? "secondary" : "ghost",
              })
            )}
            aria-label={label}
          >
            <Icon />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
