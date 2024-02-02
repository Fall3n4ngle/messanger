import { Conversation } from "../../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupInfo, ToastMessage } from "@/components";
import { Button, Form } from "@/ui";
import { editConversationSchema } from "../../validations/conversation";
import { z } from "zod";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editConversation } from "../../actions/conversation";
import { useToast } from "@/common/hooks";
import { Loader2 } from "lucide-react";

const formSchema = editConversationSchema.pick({ name: true, image: true });
type FormFields = z.infer<typeof formSchema>;

type Props = Conversation & {
  onDialogClose: Function;
};

export default function EditConversationForm({
  id,
  image,
  name,
  onDialogClose,
}: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      image,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: editConversation,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      onDialogClose();
      form.reset();

      toast({
        description: (
          <ToastMessage
            type="success"
            message="Conversation updated successfully"
          />
        ),
      });
    },
    onError: () => {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to update conversation" />
        ),
      });
    },
  });

  async function onSubmit(fields: FormFields) {
    if (fields.image === image && fields.name === name) {
      onDialogClose();
      form.reset();
      return;
    }

    mutate({ id, ...fields });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <GroupInfo isUploading={isUploading} setIsUploading={setIsUploading} />
        <Button
          disabled={isPending || isUploading}
          type="submit"
          className="self-end"
        >
          Submit
          {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
