import { Conversation } from "../../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupInfo } from "@/components";
import { Form } from "@/ui";
import { editConversationSchema } from "../../validations/conversation";
import { z } from "zod";
import { useEditConversation } from "../../hooks/useEditConversation";
import { useState } from "react";
import IsUploadingProvider from "@/common/context/isUploading";
import SubmitButton from "@/components/SubmitButton";

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
  const { mutateAsync } = useEditConversation();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      image,
    },
  });

  async function onSubmit(fields: FormFields) {
    if (fields.image === image && fields.name === name) {
      onDialogClose();
      form.reset();
      return;
    }

    const result = await mutateAsync({
      id,
      ...fields,
    });

    if (!result?.success) {
      return;
    }

    onDialogClose();
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <IsUploadingProvider
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        >
          <GroupInfo />
          <SubmitButton />
        </IsUploadingProvider>
      </form>
    </Form>
  );
}
