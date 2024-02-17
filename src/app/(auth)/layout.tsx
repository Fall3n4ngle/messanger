import { PropsWithChildren } from "react";

export default function layout({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-6">
      {children}
    </main>
  );
}
