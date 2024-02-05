import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, Users, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { NavigationItem } from "../types";

export const useLinks = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();

  const links: NavigationItem[] = [
    {
      label: "Conversations",
      href: "/conversations",
      isActive: pathname === "/conversations",
      icon: <MessageCircle />,
    },
    {
      label: "Users",
      href: "/users",
      isActive: pathname === "/users",
      icon: <Users />,
    },
    {
      label: "Logout",
      onClick: () => signOut(() => router.push("/sign-in")),
      icon: <LogOut />,
      href: "#",
    },
  ];

  return links;
};
