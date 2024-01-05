"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import FileInput from "@/components/upload/FileInput";
import { useFormContext } from "react-hook-form";

export default function GroupInfo() {
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="image"
        render={({ field }) => (
          <FormItem className="mb-2">
            <FormLabel>Group image</FormLabel>
            <FormControl>
              <FileInput value={field.value ?? ""} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>Group name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
