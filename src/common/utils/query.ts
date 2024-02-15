export const generateListKeys = (queryName: string) => {
  const queryKeys = {
    lists: () => [queryName, "list"] as const,
    list: (filters: string) => [...queryKeys.lists(), { filters }] as const,
  };

  return queryKeys;
};

export const generateDetailKeys = (queryName: string) => {
  const queryKeys = {
    details: () => [queryName, "detail"] as const,
    detail: (filters: string) => [...queryKeys.details(), { filters }] as const,
  };

  return queryKeys;
};
