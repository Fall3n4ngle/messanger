import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useState } from "react";
import { Button, Form } from "@/ui";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormFields, formSchema } from "../validations/formSchema";
import { useToast } from "@/common/hooks";
import { GroupInfo, GroupMembers, ToastMessage } from "@/components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConversation } from "../actions/conversation";

type Step = {
  id: string;
  fields: (keyof FormFields)[];
  component: JSX.Element;
};

type Props = {
  onDialogClose: Function;
};

export default function CreateConversationForm({ onDialogClose }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: [],
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createConversation,
    onSuccess: (result) => {
      onDialogClose();
      form.reset();
      setStep(0);

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      toast({
        description: (
          <ToastMessage
            type="success"
            message="Created conversation successfully"
          />
        ),
      });

      if (result?.data.id) {
        router.push(`/conversations/${result?.data?.id}`);
      }
    },
    onError: () => {
      toast({
        description: (
          <ToastMessage type="error" message="Failed to create conversation" />
        ),
      });
    },
  });

  async function onSubmit(fields: FormFields) {
    const { members, ...data } = fields;

    mutate({
      isGroup: true,
      members: members.map(({ value }) => ({ id: value })),
      ...data,
    });
  }

  const handlePreviousClick = (e: FormEvent) => {
    e.preventDefault();
    setStep((prev) => prev - 1);
  };

  const handleNextClick = async (e: FormEvent) => {
    e.preventDefault();

    const fields = steps[step].fields;

    const output = await form.trigger(fields as (keyof FormFields)[], {
      shouldFocus: true,
    });

    if (!output) return;
    setStep((prev) => prev + 1);
  };

  const steps: Step[] = [
    {
      id: "info",
      fields: ["name", "image"],
      component: (
        <GroupInfo isUploading={isUploading} setIsUploading={setIsUploading} />
      ),
    },
    {
      id: "members",
      fields: ["members"],
      component: <GroupMembers />,
    },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-between grow"
      >
        {steps[step].component}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePreviousClick}
            variant="secondary"
            disabled={step === 0}
            type="button"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={handleNextClick} variant="secondary" type="button">
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              disabled={isUploading || isPending}
              type="submit"
              className="self-end"
            >
              Submit
              {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
