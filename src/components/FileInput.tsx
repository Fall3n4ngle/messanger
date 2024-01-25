"use client";

import { UploadDropzone } from "@/lib/uploadThing/components";
import { useState, useTransition } from "react";
import { deleteFiles } from "@/common/actions/files";
import UploadImage from "./UploadImage";
import Image from "next/image";

import "@uploadthing/react/styles.css";

type Props = {
  value: string;
  onChange(newValue: string | undefined): void;
};

export default function FileInput({ value, onChange }: Props) {
  const [fileKey, setFileKey] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteFiles(fileKey);
      onChange("");
    });
  };

  if (!value) {
    return (
      <UploadDropzone
        endpoint="imageUploader"
        config={{
          mode: "auto",
        }}
        onClientUploadComplete={(result) => {
          const url = result?.[0].url;
          onChange(url);
          const key = result?.[0].key;
          setFileKey(key ?? "");
        }}
      />
    );
  }

  return (
    <div className="px-6 py-10 flex items-center justify-center">
      <UploadImage
        isPending={isPending}
        onDelete={handleDelete}
        className="mx-auto h-24 w-24"
      >
        <Image
          src={value}
          alt="image"
          fill
          className="rounded-full object-cover"
        />
      </UploadImage>
    </div>
  );
}
