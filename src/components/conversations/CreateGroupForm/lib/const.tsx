import { FormFields } from "./validations/formSchema";
import { GroupInfo, GroupMembers } from "@/components/common";

type Step = {
  id: string;
  fields: (keyof FormFields)[];
  component: JSX.Element;
};

export const steps: Step[] = [
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
