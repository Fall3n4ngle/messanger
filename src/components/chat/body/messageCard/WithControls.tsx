import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui";
import DeleteMessageButton from "./DeleteMessageButton";
import EditMessageButton from "./EditMessageButton";
import { PropsWithChildren } from "react";

type Props = {
  messageId: string;
  conversationId: string;
  content: string | null;
  file: string | null;
} & PropsWithChildren;

export default function WithControls({
  content,
  conversationId,
  file,
  messageId,
  children,
}: Props) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-[200px]">
        <ContextMenuItem onSelect={(e) => e.preventDefault()}>
          <DeleteMessageButton messageId={messageId} conversationId={conversationId} />
        </ContextMenuItem>
        <ContextMenuItem>
          <EditMessageButton id={messageId} content={content} file={file} />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
