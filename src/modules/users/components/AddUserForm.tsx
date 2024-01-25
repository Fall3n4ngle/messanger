import { useForm } from "react-hook-form";
import { FormFields, formSchema } from "../validations/formSchema";
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
} from "@/ui";
import { ToastMessage } from "@/components";
import { loadConversations } from "../api/loadConversations";
import { Option } from "@/ui/async-select";
import { SingleValue } from "react-select";
import { addMembers } from "@/common/actions/conversation/mutations";
import { useToast } from "@/common/hooks";
import { Loader2 } from "lucide-react";
import { revalidatePathFromClient } from "@/common/actions/revalidatePath";

type Props = {
  userId: string;
  onDialogClose: Function;
};

export default function AddUserForm({ userId, onDialogClose }: Props) {
  const { toast } = useToast();

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit({ conversation }: FormFields) {
    const result = await addMembers({
      id: conversation.value,
      members: [{ id: userId }],
    });

    if (result?.success) {
      toast({
        description: (
          <ToastMessage type="success" message="User added successfully" />
        ),
      });

      await revalidatePathFromClient(`/conversations/${conversation.value}`);
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
          name="conversation"
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
                    field.onChange(data as SingleValue<Option> | null);
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
