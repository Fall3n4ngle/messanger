"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ContentInput from "./ContentInput";
import { sendMessageSchema } from "../validations/message";
import { useSendMessage, useEditMessage } from "../hooks";
import { useMessageForm } from "@/common/store/useMessageForm";
import ExitEditingButton from "./ExitEditingButton";
import ImagePreview from "./ImagePreview";
import UploadButton from "./UploadButton";
import SubmitButton from "./SubmitButton";
import { useParams } from "next/navigation";
import { useMember } from "@/common/hooks";

const formSchema = sendMessageSchema.pick({ content: true, file: true });
type FormFields = z.infer<typeof formSchema>;

export default function MessageForm() {
  const conversationId = useParams().conversationId as string;
  const { messageData, resetMessageData } = useMessageForm();
  const { mutate: sendMessage, isPending: isSendingForm } = useSendMessage();
  const { mutate: updateMessage, isPending: isEditingForm } = useEditMessage();

  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    values: {
      content: messageData.content ?? "",
      file: messageData.file ?? "",
    },
  });

  const { data: member } = useMember({
    conversationId,
  });

  if (!member) return null;

  const onSubmit = async (fields: FormFields) => {
    if (isUploading) return;

    if (!messageData.isEditing || !messageData.id) {
      sendMessage({
        ...fields,
        conversationId,
        userId: member.user.id,
      });

      form.reset();
      return;
    }

    if (
      fields.content !== messageData.content ||
      fields.file !== messageData.file
    ) {
      updateMessage({
        id: messageData.id,
        conversationId,
        ...fields,
      });
    }

    resetMessageData();
    form.reset();
  };

  const isSubmitting = isSendingForm || isEditingForm;

  return (
    <div className="max-w-[1000px] w-full">
      <Form {...form}>
        <div className="flex w-full items-center justify-between">
          <ImagePreview />
          {messageData.isEditing && <ExitEditingButton />}
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-end gap-3"
        >
          <FormField
            name="file"
            control={form.control}
            render={() => (
              <FormItem>
                <FormLabel className="sr-only">Image</FormLabel>
                <FormControl>
                  <UploadButton
                    isSubmitting={isSubmitting}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel className="sr-only">Message</FormLabel>
                <FormControl>
                  <ContentInput
                    conversationId={conversationId}
                    userName={member.user.name}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <SubmitButton
            isSubmitting={isSubmitting}
            isEditing={messageData.isEditing}
            isUploading={isUploading}
          />
        </form>
      </Form>
    </div>
  );
}
