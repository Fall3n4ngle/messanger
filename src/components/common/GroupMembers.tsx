"use client";

import UsersSelect from "@/components/common/UsersSelect";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";
import { useFormContext } from "react-hook-form";

type Props = {
  excludedUsers?: string[];
};

export default function GroupMembersForm({ excludedUsers }: Props) {
  const { control, getValues } = useFormContext();

  const filterOption = (option: { value: string }) => {
    if (excludedUsers?.length === 0) return true;
    return !excludedUsers?.includes(option.value);
  };

  return (
    <FormField
      control={control}
      name="members"
      render={({ field }) => {
        return (
          <FormItem className="mb-6">
            <FormLabel htmlFor="selectMembers">Members</FormLabel>
            <UsersSelect
              isMulti
              id="selectMembers"
              defaultValue={getValues("members")}
              filterOption={filterOption}
              onChange={(data) => {
                const members = data.map(({ value, label }) => ({
                  value,
                  label,
                }));

                field.onChange(members);
              }}
            />
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
