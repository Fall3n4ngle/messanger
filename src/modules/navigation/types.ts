export type NavigationItem = {
  label: string;
  href: string;
  isActive?: boolean;
  icon: JSX.Element;
  onClick?: Function;
};

export type User = {
  id: string;
  name: string;
  image: string | null;
  clerkId: string;
};
