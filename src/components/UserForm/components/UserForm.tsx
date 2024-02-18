"use client";

import { useToast } from "@/common/hooks";
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
import { upsertUserSchema } from "../validations/user";

type Props = {
  id?: string;
  name?: string;
  image?: string | null;
  successMessage?: string;
  onDialogClose?: Function;
};

const formSchema = upsertUserSchema.pick({ image: true, name: true });
type FormFields = z.infer<typeof formSchema>;

export default function UserForm({
  id,
  name,
  image,
  onDialogClose,
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

      onDialogClose && onDialogClose();
    },
    onError: (error) => {
      toast({
        description: <ToastMessage type="error" message={error.message} />,
      });
    },
  });

  async function onSubmit(values: FormFields) {
    if (!id) {
      upsertUser(values);
      return;
    }

    if (values.name !== name || values.image !== image) {
      upsertUser({ ...values, id });
      return;
    }

    onDialogClose && onDialogClose();
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
          {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
