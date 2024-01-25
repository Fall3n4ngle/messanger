import { Pencil } from "lucide-react";
import { useMessageForm } from "@/common/store/useMessageForm";
import { Message } from "@/common/actions/messages/queries";

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
