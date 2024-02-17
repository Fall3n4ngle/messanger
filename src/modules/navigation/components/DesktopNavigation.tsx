import React from "react";
import { NavigationItem, User } from "../types";
import UserButton from "./UserButton";
import DesktopItem from "./DesktopItem";

type Props = {
  links: NavigationItem[];
} & User;

export default function DesktopNavigation({ links, ...props }: Props) {
  return (
    <aside className="hidden flex-col justify-between border-r p-4 pb-7 sm:flex">
      <nav>
        <ul className="flex flex-col gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <DesktopItem {...link} />
            </li>
          ))}
        </ul>
      </nav>
      <UserButton {...props} />
    </aside>
  );
}
