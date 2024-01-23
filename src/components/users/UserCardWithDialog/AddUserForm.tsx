import { useForm } from "react-hook-form";
import { FormFields, formSchema } from "./lib/validations/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  AsyncSelect,
  Button,
} from "@/components/ui";
import { FormMessage as ToastMessage } from "@/components/common";
import { loadConversations } from "./lib/api/loadConversations";
import { Option } from "@/components/ui/async-select";
import { SingleValue } from "react-select";
import {
  addMembers,
  revalidateConversationPath,
} from "@/lib/actions/conversation/mutations";
import { useToast } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

type Props = {
  userId: string;
  onDialogClose: Function;
};

export default function AddUserForm({ userId, onDialogClose }: Props) {
  const { toast } = useToast();

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit({ conversationId }: FormFields) {
    const result = await addMembers({
      id: conversationId,
      members: [{ id: userId }],
    });

    if (result?.success) {
      toast({
        description: (
          <ToastMessage type="success" message="User added successfully" />
        ),
      });

      await revalidateConversationPath(conversationId);
      onDialogClose();
      form.reset();
    }

    if (result?.error) {
      toast({
        description: <ToastMessage type="error" message="Error adding user" />,
      });
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="conversationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conversation</FormLabel>
              <FormControl>
                <AsyncSelect
                  isMulti={false}
                  noOptionsMessage={() => "No conversations found"}
                  loadOptions={(query) => loadConversations({ query, userId })}
                  closeMenuOnSelect
                  onChange={(data) => {
                    field.onChange((data as SingleValue<Option> | null));
                  }}
                  ref={field.ref}
                  isDisabled={field.disabled}
                  name={field.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} type="submit" className="self-end">
          Submit{" "}
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
