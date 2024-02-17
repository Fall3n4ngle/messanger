"use client";

import { useDebouncedValue, useQueryParams } from "@/common/hooks";
import { Input, InputProps } from "@/ui";
import { useEffect, useState } from "react";

type Props = {
  label: string;
} & InputProps;

export default function Search({ label, id, ...props }: Props) {
  const { setQueryParams, queryParams } = useQueryParams();
  const [query, setQuery] = useState(queryParams.get("query"));

  const debouncedQuery = useDebouncedValue(query);

  useEffect(() => {
    setQueryParams({ query: debouncedQuery });
  }, [debouncedQuery, setQueryParams]);

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Input
        placeholder="Search..."
        id={id}
        value={query ?? ""}
        onChange={(e) => setQuery(e.target.value)}
        {...props}
      />
    </div>
  );
}