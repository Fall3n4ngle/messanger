import { GroupInfo, GroupMembers } from "@/components/common";
import { FormFields, formSchema } from "./lib/const";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useState } from "react";
import ToastMessage from "@/components/common/FormMessage";
import { useToast } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { upsertGroup } from "@/lib/actions/conversation/mutations";
import { Button, Form } from "@/components/ui";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

type Step = {
  id: string;
  fields: (keyof FormFields)[];
  component: JSX.Element;
};

const steps: Step[] = [
  {
    id: "info",
    fields: ["name", "image"],
    component: <GroupInfo />,
  },
  {
    id: "members",
    fields: ["members"],
    component: <GroupMembers />,
  },
];

type Props = {
  onDialogClose: Function;
};

export default function CreateGroupForm({ onDialogClose }: Props) {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: [],
    },
    mode: "onChange",
  });

  async function onSubmit(fields: FormFields) {
    const { members, ...data } = fields;

    const result = await upsertGroup({
      ...data,
      id: "",
      isGroup: true,
      members: members.map(({ value }) => ({ id: value })),
    });

    if (result?.success) {
      toast({
        description: (
          <ToastMessage type="success" message="Group created successfully" />
        ),
      });

      onDialogClose();
      form.reset();
      setStep(0);
      router.push(`/conversations/${result.data?.id}`);
    }

    if (result?.error) {
      toast({
        description: (
          <ToastMessage type="error" message="Error creating group" />
        ),
      });
    }
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

  const { isSubmitting } = form.formState;

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
            <Button disabled={isSubmitting} type="submit">
              Submit{" "}
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
