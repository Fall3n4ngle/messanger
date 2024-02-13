import { PropsWithChildren } from "react";

export default function layout({ children }: PropsWithChildren) {
  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center p-6">
      {children}
    </main>
  );
}
