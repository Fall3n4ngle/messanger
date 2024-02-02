"use client";

import { useToast } from "@/common/hooks";
import { userSchema } from "@/common/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upsertUser as upsertUserServer } from "../actions/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  FormMessage,
  Button,
} from "@/ui";
import Dropzone from "../../Dropzone";
import ToastMessage from "../../ToastMessage";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  id?: string;
  name?: string;
  image?: string | null;
  clerkId: string;
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

  const { mutate: upsertUser, isPending } = useMutation({
    mutationFn: upsertUserServer,
    onSuccess: () => {
      toast({
        description: <ToastMessage type="success" message={successMessage} />,
      });

      onCloseModal && onCloseModal();
    },
    onError: (error) => {
      toast({
        description: <ToastMessage type="error" message={error.message} />,
      });
    },
  });

  async function onSubmit(values: FormFields) {
    if (!id) {
      upsertUser({ ...values, clerkId, id });
      return;
    }

    if (values.name !== name || values.image !== image) {
      upsertUser({ ...values, clerkId, id });
      return;
    }

    onCloseModal && onCloseModal();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="mb-2">
              <FormLabel>Profile image</FormLabel>
              <FormControl>
                <Dropzone
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
