import { Button } from "@/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        404
      </h2>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">
        Page not found
      </h4>
      <Link href="/conversations">
        <Button variant="link">Back to conversations</Button>
      </Link>
    </div>
  );
}
