"use client";

import { AsyncSelect, FormField, FormItem, FormLabel, FormMessage } from "@/ui";
import { useFormContext } from "react-hook-form";
import { loadUsers } from "../api/loadUsers";
import { useAuth } from "@clerk/nextjs";

type Props = {
  excludedUsers?: string[];
};

export default function GroupMembersForm({ excludedUsers }: Props) {
  const { userId } = useAuth();
  const { control, getValues } = useFormContext();

  const filterOption = (option: { value: string }) => {
    if (excludedUsers?.length === 0) return true;
    return !excludedUsers?.includes(option.value);
  };

  if (!userId) return null;

  return (
    <FormField
      control={control}
      name="members"
      render={({ field: { onChange, ref } }) => {
        return (
          <FormItem className="mb-6">
            <FormLabel htmlFor="selectMembers">Members</FormLabel>
            <AsyncSelect
              isMulti
              id="selectMembers"
              ref={ref}
              defaultValue={getValues("members")}
              filterOption={filterOption}
              loadOptions={(query) =>
                loadUsers({ query, currentUserClerkId: userId })
              }
              onChange={(data) => {
                onChange(data);
              }}
            />
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
