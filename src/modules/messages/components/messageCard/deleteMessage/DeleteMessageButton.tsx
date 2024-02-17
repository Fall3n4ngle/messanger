import { conversationKeys, messageKeys } from "@/common/const";
import { useToast } from "@/common/hooks";
import { useMessageForm } from "@/common/store";
import { ToastMessage } from "@/components";
import { deleteMessage } from "@/modules/messages/actions/message";
import { DeleteMessageFields } from "@/modules/messages/validations/message";
import { Button } from "@/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

type Props = {
  onDialogClose: () => void;
} & DeleteMessageFields;

export default function DeleteMessageButton({
  onDialogClose,
  ...props
}: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { messageData, resetMessageData } = useMessageForm();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteMessage,
    onSuccess: (_, { messageId, conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(conversationId),
      });

      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });

      toast({
        description: (
          <ToastMessage type="success" message="Deleted message successfully" />
        ),
      });

      if (messageId === messageData.id) {
        resetMessageData();
      }

      onDialogClose();
    },
    onError: () => {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to delete message" />
        ),
      });
    },
  });

  const handleClick = () => {
    mutate(props);
  };

  return (
    <Button variant="destructive" disabled={isPending} onClick={handleClick}>
      Delete
      {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
    </Button>
  );
}
