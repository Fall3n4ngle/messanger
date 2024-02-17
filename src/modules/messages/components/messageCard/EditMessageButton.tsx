import { Pencil } from "lucide-react";
import { useMessageForm } from "@/common/store/useMessageForm";
import { Message } from "@/common/actions/messages/queries";

type Props = Pick<Message, "id" | "content" | "file">;

export default function EditMessageButton(props: Props) {
  const { setMessageData } = useMessageForm();

  const handleClick = () => {
    setMessageData({ ...props, isEditing: true });
  };

  return (
    <button className="flex w-full items-end gap-3 p-2" onClick={handleClick}>
      <Pencil className="text-primary" />
      Edit
    </button>
  );
}
