import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { MessageCircle, Users, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export const useLinks = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();

  return useMemo(() => {
    return [
      {
        label: "Conversations",
        href: "/conversations",
        active: pathname === "/conversations",
        Icon: MessageCircle,
      },
      {
        label: "Users",
        href: "/users",
        active: pathname === "/users",
        Icon: Users,
      },
      {
        label: "Logout",
        onClick: () => signOut(() => router.push("/sign-in")),
        Icon: LogOut,
        href: "#",
      },
    ];
  }, [pathname, signOut]);
};
