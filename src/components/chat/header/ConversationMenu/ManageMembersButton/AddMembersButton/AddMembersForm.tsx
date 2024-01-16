import { useToast } from "@/lib/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormMessage } from "@/components/common";
import { Button, Form } from "@/components/ui";
import { GroupMembers } from "@/components/common";
import { addMembers } from "@/lib/actions/conversation/mutations";
import { Loader2 } from "lucide-react";
import { formMembersSchema, FormMembersFields } from "@/lib/validations";

type Props = {
  conversationId: string;
  onDialogClose: Function;
  currentMembers: string[];
};

export default function AddMembersForm({
  conversationId,
  onDialogClose,
  currentMembers,
}: Props) {
  const { toast } = useToast();

  const form = useForm<FormMembersFields>({
    resolver: zodResolver(formMembersSchema),
    defaultValues: {
      members: [],
    },
  });

  async function onSubmit({ members }: FormMembersFields) {
    const result = await addMembers({
      id: conversationId,
      members: members.map((member) => ({ id: member.value })),
    });

    if (result?.success) {
      toast({
        description: (
          <FormMessage type="success" message="Members added successfully" />
        ),
      });

      onDialogClose();
      form.reset();
    }

    if (result?.error) {
      toast({
        description: (
          <FormMessage type="error" message="Error adding members" />
        ),
      });
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col ">
        <GroupMembers excludedUsers={currentMembers} />
        <Button disabled={isSubmitting} type="submit" className="self-end">
          Submit{" "}
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
