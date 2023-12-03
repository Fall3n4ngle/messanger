"use client";

import { cn } from "@/lib/utils";
import Select, { AsyncProps } from "react-select/async";
import { GroupBase, OptionProps } from "react-select";
import { loadUsers } from "@/lib/api/loadUsers";
import { Avatar, AvatarFallback, AvatarImage } from "../ui";

type Option = {
  label: string;
  value: string;
  image: string | null;
};

export default function UsersSelect<
  IsMulti extends boolean,
  GroupType extends GroupBase<Option> = GroupBase<Option>
>({ onChange, ...props }: AsyncProps<Option, IsMulti, GroupType>) {
  return (
    <Select
      cacheOptions
      defaultOptions
      closeMenuOnSelect={false}
      loadOptions={loadUsers}
      unstyled
      classNames={classNames}
      onChange={onChange}
      components={{ Option: CustomOption }}
      {...props}
    />
  );
}

const CustomOption = <
  IsMulti extends boolean = true,
  GroupType extends GroupBase<Option> = GroupBase<Option>
>({
  innerProps,
  innerRef,
  data,
}: OptionProps<Option, IsMulti, GroupType>) => {
  const { image, label } = data;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center gap-3 cursor-pointer py-2 px-4 hover:bg-secondary rounded-md transition-colors"
    >
      <Avatar className="w-7 h-7">
        {image && <AvatarImage src={image} alt={`${label} profile image`} />}
        <AvatarFallback>{label[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <span>{label}</span>
    </div>
  );
};

const classNames = {
  control: ({ isFocused }: any) =>
    cn(
      "border border-input bg-background px-3 py-2 rounded-md ring-offset-background",
      isFocused && "ring-offset-2 ring-ring ring-2"
    ),
  valueContainer: () => "cursor-pointer",
  indicatorsContainer: () => "cursor-pointer",
  dropdownIndicator: ({ isFocused }: any) =>
    cn(
      "text-muted-foreground hover:text-foreground ml-1.5",
      isFocused && "text-foreground"
    ),
  indicatorSeparator: () => "bg-secondary ml-1.5",
  menu: () => "rounded-md mt-4 bg-background border border-input",
  menuList: () => "py-1.5",
  multiValue: () =>
    "mr-1 inline-flex items-center rounded-md border px-2.5 py-0.5 text-sm font-semibold bg-secondary text-foreground cursor-default",
  clearIndicator: () => "text-muted-foreground hover:text-foreground ml-1.5",
  multiValueRemove: () => "ml-1.5 text-muted-foreground hover:text-foreground transition-colors",
  loadingIndicator: () => "mr-1",
  placeholder: () => "text-muted-foreground",
};
