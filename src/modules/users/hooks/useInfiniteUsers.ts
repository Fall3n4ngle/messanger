import { getUsers } from "@/common/actions/user/queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PER_PAGE } from "../const";

type Props = {
  query: string | null;
};

export const useInfiniteUsers = ({ query }: Props) => {
  const getData = async ({ pageParam }: { pageParam?: string }) => {
    return await getUsers({
      lastCursor: pageParam,
      query,
      take: PER_PAGE,
    });
  };

  return useInfiniteQuery({
    queryKey: ["users", query],
    queryFn: getData,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < PER_PAGE) {
        return;
      }

      return lastPage[lastPage.length - 1].id;
    },
    throwOnError: true,
  });
};
