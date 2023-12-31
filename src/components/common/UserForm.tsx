"use client";

import { useToast } from "@/lib/hooks";
import { userSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upsertUser } from "@/lib/actions/user/mutations";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  FormMessage,
} from "@/components/ui";
import { Loader } from "lucide-react";
import FileInput from "../upload/FileInput";
import ToastMessage from "./FormMessage";

type Props = {
  name?: string;
  image?: string | null;
  clerkId: string;
  errorMessage?: string;
  successMessage?: string;
};

const formSchema = userSchema.pick({ image: true, name: true });
type FormFields = z.infer<typeof formSchema>;

export default function UserForm({
  name,
  image,
  clerkId,
  successMessage = "Profile updated successfully",
  errorMessage = "Error updating profile",
}: Props) {
  const { toast } = useToast();

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name ?? "",
      image: image ?? "",
    },
  });

  async function onSubmit(values: FormFields) {
    const result = await upsertUser({ ...values, clerkId });

    if (result?.success) {
      toast({
        description: <ToastMessage type="success" message={successMessage} />,
      });
    }

    if (result?.error) {
      console.log(result.error);
      
      toast({
        description: <ToastMessage type="error" message={errorMessage} />,
      });
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Profile image</FormLabel>
              <FormControl>
                <FileInput
                  value={field.value ?? ""}
                  onChange={field.onChange}
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
            <FormItem className="mb-4">
              <FormLabel>User name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} type="submit">
          Submit{" "}
          {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
