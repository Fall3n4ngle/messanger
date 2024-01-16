import { Conversation } from "./lib/types";
import { useToast } from "@/lib/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { revalidateConversationPath } from "@/lib/actions/conversation/mutations";
import ToastMessage from "@/components/common/FormMessage";
import { Button, Form } from "@/components/ui";
import { GroupInfo } from "@/components/common";
import { Loader2 } from "lucide-react";
import { updateGroupSchema } from "@/lib/validations";
import { z } from "zod";
import { useUpdateGroup } from "./lib/hooks/useUpdateGroup";

const formSchema = updateGroupSchema.pick({ name: true, image: true });
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
  const { mutateAsync } = useUpdateGroup();

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
      await revalidateConversationPath(id);

      toast({
        description: (
          <ToastMessage type="success" message="Group updated successfully" />
        ),
      });

      onDialogClose();
      form.reset();
    }

    if (result?.error) {
      toast({
        description: (
          <ToastMessage type="error" message="Error updating group" />
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
