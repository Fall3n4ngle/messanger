import { NavigationItem, User } from "../types";
import MobileItem from "./MobileItem";
import ProfileDialog from "./ProfileDialog";

type Props = {
  links: NavigationItem[];
} & User;

export default function MobileNavigation({ links, ...props }: Props) {
  return (
    <div className="fixed bottom-0 right-0 z-10 hidden w-full items-center justify-center gap-5 bg-background px-3 py-4 max-sm:flex">
      <nav>
        <ul className="flex items-center gap-5">
          {links.map((link) => (
            <li key={link.href}>
              <MobileItem {...link} />
            </li>
          ))}
        </ul>
      </nav>
      <ProfileDialog {...props} />
    </div>
  );
}
