import { useForm } from "react-hook-form";
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
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { selectItemSchema } from "@/common/validations";

const formSchema = z.object({
  conversation: z.object(selectItemSchema.shape, {
    required_error: "Select a conversation",
  }),
});

type FormFields = z.infer<typeof formSchema>;

type Props = {
  userId: string;
  onDialogClose: Function;
};

export default function AddUserForm({ userId, onDialogClose }: Props) {
  const { toast } = useToast();

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addMembers,
    onSuccess: () => {
      toast({
        description: (
          <ToastMessage type="success" message="User added successfully" />
        ),
      });

      onDialogClose();
      form.reset();
    },
    onError: () => {
      toast({
        description: <ToastMessage type="error" message="Failed to add user" />,
      });
    },
  });

  async function onSubmit({ conversation }: FormFields) {
    mutate({
      id: conversation.value,
      members: [{ id: userId }],
    });
  }

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
                  noOptionsMessage={() => (
                    <p className="py-2">No conversations found</p>
                  )}
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
        <Button disabled={isPending} type="submit" className="self-end">
          Submit
          {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
