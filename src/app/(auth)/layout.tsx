import { PropsWithChildren } from "react";

export default function layout({ children }: PropsWithChildren) {
  return (
    <main className="h-full w-full grid place-items-center py-12">{children}</main>
  );
}
