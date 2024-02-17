import Link from "next/link";
import { NavigationItem } from "../types";
import { cn } from "@/common/utils";
import { buttonVariants } from "@/ui";

export default function MobileItem({
  href,
  icon,
  label,
  isActive,
  onClick,
}: NavigationItem) {
  return (
    <Link
      href={href}
      onClick={() => {
        onClick && onClick();
      }}
      className={cn(
        buttonVariants({
          variant: isActive ? "secondary" : "ghost",
        }),
      )}
      aria-label={label}
    >
      {icon}
    </Link>
  );
}
