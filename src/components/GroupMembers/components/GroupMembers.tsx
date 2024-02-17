"use client";

import {
  AsyncSelect,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui";
import { useFormContext } from "react-hook-form";
import { loadUsers } from "../api/loadUsers";

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
      render={({ field: { onChange, ref } }) => {
        return (
          <FormItem className="mb-6">
            <FormLabel htmlFor="selectMembers">Members</FormLabel>
            <FormControl>
              <AsyncSelect
                isMulti
                id="selectMembers"
                ref={ref}
                defaultValue={getValues("members")}
                filterOption={filterOption}
                loadOptions={(query) => loadUsers({ query })}
                onChange={(data) => {
                  onChange(data);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
