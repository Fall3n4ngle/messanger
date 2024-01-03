import { Pencil } from "lucide-react";
import { Message } from "../lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";

type Props = Pick<Message, "id" | "content" | "file">;

export default function EditMessageButton(props: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full flex items-end gap-3">
          <Pencil className="text-primary" />
          Edit
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit message</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
