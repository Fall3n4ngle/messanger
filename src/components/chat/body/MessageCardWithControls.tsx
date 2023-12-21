import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui";
import MessageCard, { MessageCardPorps } from "./MessageCard";
import DeleteMessageButton from "./DeleteMessageButton";
import EditMessageButton from "./EditMessageButton";

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
          <EditMessageButton
            id={props.id}
            content={props.content}
            file={props.file}
          />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
