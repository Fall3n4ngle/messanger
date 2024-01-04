"use client";

import { FormEvent, useState } from "react";
import { Button, Dialog, DialogContent, Form } from "../../ui";
import { ChevronRight, Loader2 } from "lucide-react";
import { FormFields, formSchema } from "./lib/const";
import { useToast } from "@/lib/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertGroup } from "@/lib/actions/conversation/mutations";
import ToastMessage from "@/components/common/FormMessage";
import { ChevronLeft } from "lucide-react";
import { GroupInfo, GroupMembers } from "@/components/common";
import { Header } from "./Header";
import { Trigger } from "./Trigger";
import { useRouter } from "next/navigation";

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

export default function CreateGroupButton() {
  const [isOpen, setIsOpen] = useState(false);
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

      setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Trigger />
      <DialogContent className="min-h-[400px] flex flex-col gap-4">
        <Header />
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
                <Button
                  onClick={handleNextClick}
                  variant="secondary"
                  type="button"
                >
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
      </DialogContent>
    </Dialog>
  );
}
