import { Conversation } from "../../types";
import { useToast } from "@/common/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastMessage, GroupInfo } from "@/components";
import { Button, Form } from "@/ui";
import { Loader2 } from "lucide-react";
import { editConversationSchema } from "../../validations/conversation";
import { z } from "zod";
import { useEditConversation } from "../../hooks/useEditConversation";
import { revalidatePathFromClient } from "@/common/actions/revalidatePath";

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
  const { mutateAsync } = useEditConversation();

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      image,
    },
  });

  async function onSubmit(fields: FormFields) {
    const result = await mutateAsync({
      id,
      ...fields,
    });

    if (result?.success) {
      await revalidatePathFromClient(`/conversations/${id}`);

      toast({
        description: (
          <ToastMessage
            type="success"
            message="Conversation updated successfully"
          />
        ),
      });

      onDialogClose();
      form.reset();
    }

    if (result?.error) {
      toast({
        description: (
          <ToastMessage type="error" message="Error updating conversation" />
        ),
      });
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <GroupInfo />
        <Button disabled={isSubmitting} type="submit" className="self-end">
          Submit{" "}
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
