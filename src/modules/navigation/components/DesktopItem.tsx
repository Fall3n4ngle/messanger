import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  buttonVariants,
} from "@/ui";
import { cn } from "@/common/utils";
import { NavigationItem } from "../types";

export default function DesktopItem({
  href,
  icon,
  label,
  isActive,
  onClick,
}: NavigationItem) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            onClick={() => {
              onClick && onClick();
            }}
            className={cn(
              buttonVariants({
                size: "icon",
                variant: isActive ? "secondary" : "ghost",
              }),
            )}
            aria-label={label}
          >
            {icon}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
