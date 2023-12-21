import { FormMessage } from "@/components/common";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/components/ui";
import { deleteMessage } from "@/lib/actions/messages/mutations";
import { useToast } from "@/lib/hooks";
import { Loader2, Trash2 } from "lucide-react";
import { ReactNode, useState, useTransition } from "react";

type Props = {
  id: string;
  children?: ReactNode;
  conversationId: string;
};

export default function DeleteMessageButton(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleClick = () =>
    startTransition(async () => {
      const result = await deleteMessage(props);

      if (result.success) {
        setIsOpen(false);

        toast({
          description: (
            <FormMessage type="success" message="Message was deleted" />
          ),
        });
      }

      if (result.error) {
        toast({
          description: (
            <FormMessage type="error" message="Error deleting message" />
          ),
        });
      }
    });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button className="w-full flex items-end gap-3">
          <Trash2 className="text-destructive" /> <span>Delete</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are going to delete this message. You will not be able to see it
            again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleClick}
          >
            Delete
            {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
