import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui";
import MessageCard, { MessageCardPorps } from "./MessageCard";
import { Trash2, Pencil } from "lucide-react";
import DeleteMessageButton from "./DeleteMessageButton";

export default function MessageCardWithControls(props: MessageCardPorps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div>
          <MessageCard {...props} />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-[200px]">
        <ContextMenuItem onSelect={(e) => e.preventDefault()}>
          <DeleteMessageButton
            id={props.id}
            conversationId={props.conversationId}
          />
        </ContextMenuItem>
        <ContextMenuItem>
          <Pencil className="mr-3 text-primary" />
          Edit
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
