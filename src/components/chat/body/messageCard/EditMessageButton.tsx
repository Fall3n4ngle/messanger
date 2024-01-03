import { Pencil } from "lucide-react";
import { useMessageForm } from "../../lib/store/useMessageForm";

type Props = {
  id: string;
  content: string | null;
  file: string | null;
};

export default function EditMessageButton(props: Props) {
  const { setMessage } = useMessageForm();

  const handleClick = () => {
    setMessage(props);
  };

  return (
    <button onClick={handleClick} className="w-full flex items-end gap-3">
      <Pencil className="text-primary" />
      Edit
    </button>
  );
}
