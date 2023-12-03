"use client";

import { upsertConversation } from "@/lib/actions/conversation/mutations";
import { useToast } from "@/lib/hooks";
import { ConversationFields, conversationSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ToastMessage from "./FormMessage";
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
import UsersSelect from "./UsersSelect";

type Member = {
  value: string;
  label: string;
  image: string;
};

type Props = {
  id?: string;
  name?: string;
  image?: string | null;
  members?: Member[];
  successMessage?: string;
  errorMessage?: string;
};

export default function ConversationForm({
  id = "",
  name = "",
  image = "",
  members = [],
  errorMessage = "Error upserting conversation",
  successMessage = "Conversation upserted successfully",
}: Props) {
  const { toast } = useToast();

  const form = useForm<ConversationFields>({
    resolver: zodResolver(conversationSchema),
    defaultValues: {
      name,
      image,
      members: members.map(({ value }) => ({ id: value })),
    },
  });

  async function onSubmit(fields: ConversationFields) {
    const result = await upsertConversation({ ...fields, id });

    if (result?.success) {
      toast({
        description: <ToastMessage type="success" message={successMessage} />,
      });

      form.reset();
    }

    if (result?.error) {
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
              <FormLabel>Conversation image</FormLabel>
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
              <FormLabel>Conversation name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="members"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel htmlFor="selectMembers">Add members</FormLabel>
              <UsersSelect
                isMulti
                id="selectMembers"
                onChange={(data) => {
                  const members = data.map(({ value }) => ({ id: value }));
                  field.onChange(members);
                }}
              />
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
