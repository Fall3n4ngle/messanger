"use client";

import UsersSelect from "@/components/common/UsersSelect";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";
import { useFormContext } from "react-hook-form";

export default function GroupMembersForm() {
  const { control, getValues } = useFormContext();

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
