"use client";

import { FormMessage as ToastMessage } from "@/components/common";
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
} from "@/components/ui";
import { UploadButton, UploadImage } from "@/components/upload";
import { deleteFiles } from "@/lib/actions/files";
import { useToast } from "@/lib/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Loader2, SendHorizontal } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MessageFormInput from "./MessageFormInput";
import { Message } from "../lib/types";
import { sendMessageSchema } from "@/lib/validations";
import { useSendMessage } from "./lib/hooks/useSendMessage";
import { v4 as uuidv4 } from "uuid";

type Props = {
  conversationId: string;
} & Pick<Message, "member">;

const formSchema = sendMessageSchema.pick({ content: true, file: true });
type FormFields = z.infer<typeof formSchema>;

export default function MessageForm({ conversationId, member }: Props) {
  const { toast } = useToast();

  const [fileKey, setFileKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const { mutate, isSuccess } = useSendMessage({ member });

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const handleUploadError = (error: Error) => {
    toast({
      description: <ToastMessage type="error" message={error.message} />,
    });

    setIsUploading(false);
  };

  const handleDelete = () =>
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

  const onSubmit = async (fields: FormFields) => {
    mutate({
      ...fields,
      conversationId,
      memberId: member.id,
      id: uuidv4(),
      updatedAt: new Date(),
    });

    if (isSuccess) {
      form.reset();
      form.setValue("content", "");
    }
  };

  const { isSubmitting } = form.formState;
  const url = form.watch("file");

  return (
    <div className="px-6 py-4 border-t">
      <div>
        {url && (
          <UploadImage
            isPending={isPending}
            onDelete={handleDelete}
            className="w-28 h-28 mb-5 ml-[52px]"
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
                    <TooltipTrigger asChild>
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
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel className="sr-only">Write a message</FormLabel>
                <FormControl>
                  <MessageFormInput
                    conversationId={conversationId}
                    userName={member.user.name}
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
