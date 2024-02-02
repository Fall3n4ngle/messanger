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
} from "@/ui";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessageForm } from "@/common/store";
import { useToast } from "@/common/hooks";
import { deleteMessage } from "../../actions/message";
import { ToastMessage } from "@/components";

type Props = {
  messageId: string;
  conversationId: string;
  previousMessageId: string | null;
};

export default function DeleteMessageButton({
  conversationId,
  messageId,
  previousMessageId,
}: Props) {
  const queryClient = useQueryClient();
  const { messageData, resetMessageData } = useMessageForm();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteMessage,
    onError: () => {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to delete message" />
        ),
      });
    },
    onSuccess: (_, { messageId }) => {
      toast({
        description: (
          <ToastMessage type="success" message="Deleted message successfully" />
        ),
      });

      if (messageId === messageData.id) {
        resetMessageData();
      }

      setIsOpen(false);
    },
    onSettled: (_data, _error, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });

  const handleClick = () => {
    mutate({ conversationId, messageId, previousMessageId });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button className="w-full flex items-end gap-3 p-2">
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
            className="self-end"
            variant="destructive"
            disabled={isPending}
            onClick={handleClick}
          >
            Delete
            {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
