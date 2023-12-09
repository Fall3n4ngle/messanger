"use client";

import { FormMessage as ToastMessage } from "@/components/common";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  inputClassName,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { UploadButton, UploadImage } from "@/components/upload";
import { deleteFiles } from "@/lib/actions/files";
import { upsertMessage } from "@/lib/actions/messages/mutations";
import { useToast } from "@/lib/hooks";
import { messageSchema } from "@/lib/validations/message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Loader, SendHorizontal } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";

type Props = {
  conversationId: string;
};

const formSchema = messageSchema.pick({ content: true, file: true });
type FormFields = z.infer<typeof formSchema>;

export default function MessageForm({ conversationId }: Props) {
  const { toast } = useToast();
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const handleUploadError = (error: Error) => {
    toast({
      description: <ToastMessage type="error" message={error.message} />,
    });
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
    const result = await upsertMessage({ ...fields, conversationId });

    if (result?.success) {
      form.reset();
      form.setValue("content", "");
    }

    if (result?.error) {
      toast({
        description: (
          <ToastMessage type="error" message="Error sending message" />
        ),
      });
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
                        className="rounded-full !mt-0"
                        onUploadError={handleUploadError}
                        onClientUploadComplete={(result) => {
                          const { key, url } = result[0];
                          field.onChange(url);
                          setFileKey(key);
                        }}
                        renderChildren={({ isUploading }) =>
                          isUploading ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <ImageIcon />
                          )
                        }
                      />
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
                  <TextareaAutosize
                    id="message"
                    placeholder="Write a message..."
                    className={cn(
                      inputClassName,
                      "!m-0 resize-none bg-secondary dark:bg-secondary/50 border-none"
                    )}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader className="h-4 w-4 animate-spin" />
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
