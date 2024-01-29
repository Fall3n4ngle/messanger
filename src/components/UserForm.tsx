"use client";

import { useToast } from "@/common/hooks";
import { userSchema } from "@/common/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upsertUser as upsertUserServer } from "@/common/actions/user/mutations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  FormMessage,
} from "@/ui";
import { Dropzone } from "@/components";
import ToastMessage from "./ToastMessage";
import { useMutation } from "@tanstack/react-query";
import IsUploadingProvider from "@/common/context/isUploading";
import { useState } from "react";
import SubmitButton from "./SubmitButton";

type Props = {
  id?: string;
  name?: string;
  image?: string | null;
  clerkId: string;
  errorMessage?: string;
  successMessage?: string;
  onCloseModal?: Function;
};

const formSchema = userSchema.pick({ image: true, name: true });
type FormFields = z.infer<typeof formSchema>;

export default function UserForm({
  id,
  name,
  image,
  clerkId,
  onCloseModal,
  successMessage = "Profile updated successfully",
  errorMessage = "Error updating profile",
}: Props) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name ?? "",
      image: image ?? "",
    },
  });

  const { mutateAsync: upsertUser } = useMutation({
    mutationFn: upsertUserServer,
    onSuccess: () => {
      toast({
        description: <ToastMessage type="success" message={successMessage} />,
      });

      if (onCloseModal) {
        onCloseModal();
      }
    },
    onError: () => {
      toast({
        description: <ToastMessage type="error" message={errorMessage} />,
      });
    },
  });

  async function onSubmit(values: FormFields) {
    if (!id) {
      await upsertUser({ ...values, clerkId, id });
      return;
    }

    if (values.name !== name || values.image !== image) {
      await upsertUser({ ...values, clerkId, id });
    }

    onCloseModal && onCloseModal();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <IsUploadingProvider
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        >
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem className="mb-2">
                <FormLabel>Profile image</FormLabel>
                <FormControl>
                  <Dropzone />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>User name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end">
            <SubmitButton />
          </div>
        </IsUploadingProvider>
      </form>
    </Form>
  );
}
