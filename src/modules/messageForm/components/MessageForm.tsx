"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ContentInput from "./ContentInput";
import { sendMessageSchema } from "../validations/message";
import { useSendMessage, useEditMessage } from "../hooks";
import { v4 as uuidv4 } from "uuid";
import { useMessageForm } from "@/common/store/useMessageForm";
import { Message } from "@/common/actions/messages/queries";
import ExitEditingButton from "./ExitEditingButton";
import ImagePreview from "./ImagePreview";
import UploadButton from "./UploadButton";
import IsUploadingProvider from "@/common/context/isUploading";
import SubmitButton from "./SubmitButton";

type Props = {
  conversationId: string;
} & Pick<Message, "user">;

const formSchema = sendMessageSchema.pick({ content: true, file: true });
type FormFields = z.infer<typeof formSchema>;

export default function MessageForm({ conversationId, user }: Props) {
  const { messageData, resetMessageData } = useMessageForm();
  const { mutate: sendMessage } = useSendMessage({ user });
  const { mutate: updateMessage } = useEditMessage();

  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    values: {
      content: messageData.content ?? "",
      file: messageData.file ?? "",
    },
  });

  const onSubmit = async (fields: FormFields) => {
    if (isUploading) return;

    if (!messageData.isUpdating || !messageData.id) {
      sendMessage({
        ...fields,
        conversationId,
        userId: user.id,
        id: uuidv4(),
        updatedAt: new Date(),
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

  return (
    <div className="px-6 py-4 max-w-[1000px] w-full">
      <Form {...form}>
        <IsUploadingProvider
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        >
          <div className="flex w-full items-center justify-between">
            <ImagePreview />
            {messageData.isUpdating && <ExitEditingButton />}
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
                    <UploadButton />
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
                      userName={user.name}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <SubmitButton />
          </form>
        </IsUploadingProvider>
      </Form>
    </div>
  );
}