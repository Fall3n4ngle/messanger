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
import { Dispatch, KeyboardEvent, SetStateAction } from "react";

type Props = {
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
};

export default function GroupInfo(props: Props) {
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
