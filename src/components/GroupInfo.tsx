"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/ui";
import Dropzone from "./Dropzone";
import { useFormContext } from "react-hook-form";
import { KeyboardEvent } from "react";

export default function GroupInfo() {
  const { control } = useFormContext();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <>
      <FormField
        control={control}
        name="image"
        render={() => (
          <FormItem className="mb-2">
            <FormLabel>Group image</FormLabel>
            <FormControl>
              <Dropzone />
            </FormControl>
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
              <Input {...field} onKeyDown={handleKeyDown} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
