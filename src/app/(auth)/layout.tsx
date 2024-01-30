import { PropsWithChildren } from "react";

export default function layout({ children }: PropsWithChildren) {
  return (
    <main className="h-full w-full grid place-items-center px-4">{children}</main>
  );
}
