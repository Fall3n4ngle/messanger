"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/ui";
import { Dropzone } from "@/components";
import { useFormContext } from "react-hook-form";
import { Dispatch, FormEvent, KeyboardEvent, SetStateAction } from "react";

type Props = {
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
  onSubmit: (e: FormEvent) => void;
};

export default function GroupInfo({ onSubmit, ...props }: Props) {
  const { control } = useFormContext();

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit(e);
    }
  };

  return (
    <>
      <FormField
        control={control}
        name="image"
        render={() => (
          <FormItem className="mb-2">
            <FormLabel>Image</FormLabel>
            <FormControl>
              <Dropzone {...props} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>Name</FormLabel>
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
