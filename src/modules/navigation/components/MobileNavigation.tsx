import { NavigationItem, User } from "../types";
import MobileItem from "./MobileItem";
import UserButton from "./UserButton";

type Props = {
  links: NavigationItem[];
} & User;

export default function MobileNavigation({ links, ...props }: Props) {
  return (
    <div className="max-sm:flex hidden items-center justify-center py-4 px-3 gap-5 w-full fixed bottom-0 right-0 z-10 bg-background">
      <nav>
        <ul className="flex items-center gap-5">
          {links.map((link) => (
            <li key={link.href}>
              <MobileItem {...link} />
            </li>
          ))}
        </ul>
      </nav>
      <UserButton {...props} />
    </div>
  );
}
