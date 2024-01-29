import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useState } from "react";
import { Button, Form } from "@/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNewConversation } from "../hooks/useNewConversation";
import { useRouter } from "next/navigation";
import { FormFields, formSchema } from "../validations/formSchema";
import { steps } from "../const";
import IsUploadingProvider from "@/common/context/isUploading";
import { useToast } from "@/common/hooks";
import { ToastMessage } from "@/components";
import SubmitButton from "@/components/SubmitButton";

type Props = {
  onDialogClose: Function;
};

export default function CreateConversationForm({ onDialogClose }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: createConversation } = useNewConversation();

  const [step, setStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: [],
    },
    mode: "onChange",
  });

  async function onSubmit(fields: FormFields) {
    const { members, ...data } = fields;

    await createConversation(
      {
        isGroup: true,
        members: members.map(({ value }) => ({ id: value })),
        ...data,
      },
      {
        onSuccess(result) {
          onDialogClose();
          form.reset();
          setStep(0);

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
        onError() {
          toast({
            description: (
              <ToastMessage
                type="error"
                message="Failed to create conversation"
              />
            ),
          });
        },
      }
    );
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

  return (
    <Form {...form}>
      <IsUploadingProvider
        isUploading={isUploading}
        setIsUploading={setIsUploading}
      >
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
              <Button
                onClick={handleNextClick}
                variant="secondary"
                type="button"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <SubmitButton />
            )}
          </div>
        </form>
      </IsUploadingProvider>
    </Form>
  );
}