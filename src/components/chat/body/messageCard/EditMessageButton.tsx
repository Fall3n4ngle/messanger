import { Pencil } from "lucide-react";
import { Message } from "../../lib/types";
import { useMessageForm } from "../../store/useMessageForm";

type Props = Pick<Message, "id" | "content" | "file">;

export default function EditMessageButton(props: Props) {
  const { setMessageData } = useMessageForm();

  const handleClick = () => {
    setMessageData({ ...props, isUpdating: true });
  };

  return (
    <button className="w-full flex items-end gap-3 p-2" onClick={handleClick}>
      <Pencil className="text-primary" />
      Edit
    </button>
  );
}
