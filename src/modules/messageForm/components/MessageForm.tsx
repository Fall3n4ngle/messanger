"use client";

import { ToastMessage, UploadButton, UploadImage } from "@/components";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui";
import { deleteFiles } from "@/common/actions/files";
import { useToast } from "@/common/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Loader2, SendHorizontal, X } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MessageFormInput from "./MessageFormInput";
import { sendMessageSchema } from "../validations/message";
import { useSendMessage, useEditMessage } from "../hooks";
import { v4 as uuidv4 } from "uuid";
import { useMessageForm } from "@/common/store/useMessageForm";
import { Message } from "@/common/actions/messages/queries";

type Props = {
  conversationId: string;
} & Pick<Message, "user">;

const formSchema = sendMessageSchema.pick({ content: true, file: true });
type FormFields = z.infer<typeof formSchema>;

export default function MessageForm({ conversationId, user }: Props) {
  const { toast } = useToast();
  const { messageData, setMessageData } = useMessageForm();
  const { mutate: sendMessage } = useSendMessage({ user });
  const { mutate: updateMessage } = useEditMessage();

  const [fileKey, setFileKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    values: {
      content: messageData.content ?? "",
      file: messageData.file ?? "",
    },
  });

  const handleUploadError = (error: Error) => {
    toast({
      description: <ToastMessage type="error" message={error.message} />,
    });

    setIsUploading(false);
  };

  const handleDelete = () => {
    if (messageData.isUpdating) {
      form.setValue("file", "");
      return;
    }

    startTransition(async () => {
      if (!fileKey) return;

      const result = await deleteFiles(fileKey);

      if (result?.error) {
        toast({
          description: <ToastMessage type="error" message={result.error} />,
        });
      }

      form.setValue("file", "");
    });
  };

  const resetMessageData = () => {
    setMessageData({
      id: null,
      content: null,
      file: null,
      isUpdating: false,
    });
  };

  const onSubmit = async (fields: FormFields) => {
    if (messageData.isUpdating && messageData.id) {
      updateMessage({
        id: messageData.id,
        conversationId,
        ...fields,
      });

      resetMessageData();
    } else {
      sendMessage({
        ...fields,
        conversationId,
        userId: user.id,
        id: uuidv4(),
        updatedAt: new Date(),
      });
    }

    form.reset();
    form.setValue("content", "");
  };

  const { isSubmitting } = form.formState;
  const url = form.watch("file");

  return (
    <div className="px-6 py-4 border-t">
      <div className="flex w-full items-center justify-between">
        {url && (
          <UploadImage
            isPending={isPending}
            onDelete={handleDelete}
            className="w-28 h-28 ml-[52px] mb-5"
          >
            <div className="relative w-full h-full ">
              <Image
                src={url}
                alt="Attached image"
                fill
                className="object-cover rounded-md"
              />
            </div>
          </UploadImage>
        )}
        {messageData.isUpdating && (
          <Button
            variant="ghost"
            size="icon"
            onClick={resetMessageData}
            className="ml-auto rounded-full mb-5"
          >
            <X className="w-4.5 h-4.5" />
          </Button>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-end gap-3"
        >
          <FormField
            name="file"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Attach image</FormLabel>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger className="!mt-0" asChild>
                      <UploadButton
                        className="rounded-full"
                        onUploadError={handleUploadError}
                        onBeforeUploadBegin={(files) => {
                          setIsUploading(true);
                          return files;
                        }}
                        onClientUploadComplete={(result) => {
                          const { key, url } = result[0];
                          field.onChange(url);
                          setFileKey(key);
                          setIsUploading(false);
                        }}
                        disabled={isSubmitting || isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <ImageIcon />
                        )}
                      </UploadButton>
                    </TooltipTrigger>
                    <TooltipContent>Attach image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormItem>
            )}
          />
          <FormField
            name="content"
            control={form.control}
            render={({ field: { ref, ...field } }) => (
              <FormItem className="grow">
                <FormLabel className="sr-only">Write a message</FormLabel>
                <FormControl>
                  <MessageFormInput
                    conversationId={conversationId}
                    userName={user.name}
                    ref={ref}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full"
                  aria-label="Send message"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendHorizontal />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
      </Form>
    </div>
  );
}
