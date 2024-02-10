import { Button } from "@/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-3 w-full h-full items-center justify-center">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        404
      </h2>
      <h4 className="scroll-m-20 text-xl font-semibold text-muted-foreground tracking-tight">
        Page not found
      </h4>
      <Link href="/conversations">
        <Button variant="link">Back to conversations</Button>
      </Link>
    </div>
  );
}
