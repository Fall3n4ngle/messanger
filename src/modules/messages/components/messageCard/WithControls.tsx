import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/ui";
import DeleteMessageButton from "./deleteMessage/DeleteMessageDialog";
import EditMessageButton from "./EditMessageButton";
import { PropsWithChildren } from "react";
import { DeleteMessageFields } from "../../validations/message";

type Props = {
  content: string | null;
  file: string | null;
} & DeleteMessageFields &
  PropsWithChildren;

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
        <ContextMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
          <DeleteMessageButton
            messageId={messageId}
            conversationId={conversationId}
          />
        </ContextMenuItem>
        <ContextMenuItem className="p-0">
          <EditMessageButton id={messageId} content={content} file={file} />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
