import { useMessage } from "@/store/useMessage";
import { Pencil } from "lucide-react";

type Props = {
  id: string;
  content: string | null;
  file: string | null;
};

export default function EditMessageButton(props: Props) {
  const { setMessage } = useMessage();

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
