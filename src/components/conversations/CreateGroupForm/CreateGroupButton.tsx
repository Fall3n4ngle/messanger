"use client";

import { useState } from "react";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Form,
} from "../../ui";
import { ChevronRight, Loader2, UserPlus } from "lucide-react";
import { FormFields, formSchema } from "./lib/const";
import { useToast } from "@/lib/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertGroup } from "@/lib/actions/conversation/mutations";
import ToastMessage from "@/components/common/FormMessage";
import { ChevronLeft } from "lucide-react";
import { GroupInfo, GroupMembers } from "@/components/common";

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
  const [step, setStep] = useState(0);
  const { toast } = useToast();

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: [],
    },
  });

  async function onSubmit(fields: FormFields) {
    const result = await upsertGroup({
      ...fields,
      id: "",
      isGroup: true,
    });

    if (result?.success) {
      toast({
        description: (
          <ToastMessage type="success" message={"Group created successfully"} />
        ),
      });

      form.reset();
    }

    if (result?.error) {
      toast({
        description: (
          <ToastMessage type="error" message={"Error creating group"} />
        ),
      });
    }
  }

  const handlePreviousClick = () => {
    setStep((prev) => prev - 1);
  };

  const handleNextClick = async () => {
    const fields = steps[step].fields;

    const output = await form.trigger(fields as (keyof FormFields)[], {
      shouldFocus: true,
    });

    if (!output) return;
    setStep((prev) => prev + 1);
  };

  const { isSubmitting } = form.formState;

  return (
    <Dialog>
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
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={handleNextClick} variant="secondary">
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

const Trigger = () => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Create group conversation"
            className="rounded-full"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
      </TooltipTrigger>
      <TooltipContent>Create group</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const Header = () => {
  return (
    <DialogHeader>
      <DialogTitle>Create group</DialogTitle>
      <DialogDescription>
        Choose group name, image and add other users
      </DialogDescription>
    </DialogHeader>
  );
};
