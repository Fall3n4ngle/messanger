"use client";

import NavigationItem from "./NavigationItem";
import UserButton from "./UserButton";
import { useLinks } from "./lib/hooks/useLinks";

type Props = {
  name: string;
  image: string | null;
  clerkId: string;
};

export default function Navigation(props: Props) {
  const links = useLinks();

  return (
    <aside className="p-4 pb-7 border-r flex flex-col justify-between">
      <nav>
        <ul className="flex flex-col gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <NavigationItem {...link} />
            </li>
          ))}
        </ul>
      </nav>
      <UserButton {...props} />
    </aside>
  );
}
