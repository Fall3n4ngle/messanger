import { useToast } from "@/common/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ToastMessage } from "@/components";
import { Button, Form } from "@/ui";
import { GroupMembers } from "@/components";
import { formMembersSchema, FormMembersFields } from "@/common/validations";
import { addMembers } from "@/common/actions/conversation/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { conversationKeys } from "@/common/const";

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
  const queryClient = useQueryClient();

  const form = useForm<FormMembersFields>({
    resolver: zodResolver(formMembersSchema),
    defaultValues: {
      members: [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addMembers,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(conversationId),
      });

      toast({
        description: (
          <ToastMessage type="success" message="Members added successfully" />
        ),
      });

      onDialogClose();
      form.reset();
    },
    onError: () => {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to add members" />
        ),
      });
    },
  });

  async function onSubmit({ members }: FormMembersFields) {
    mutate({
      id: conversationId,
      members: members.map((member) => ({ id: member.value })),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col ">
        <GroupMembers excludedUsers={currentMembers} />
        <Button disabled={isPending} type="submit" className="self-end">
          Submit
          {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
