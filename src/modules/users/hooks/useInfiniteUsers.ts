import { getUsers } from "@/common/actions/user/queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { USERS_PER_PAGE } from "../const";
import { userKeys } from "@/common/const";

type Props = {
  query: string;
};

export const useInfiniteUsers = ({ query }: Props) => {
  const getData = async ({ pageParam }: { pageParam?: string }) => {
    return await getUsers({
      lastCursor: pageParam,
      query,
      take: USERS_PER_PAGE,
    });
  };

  return useInfiniteQuery({
    queryKey: userKeys.list(query),
    queryFn: getData,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < USERS_PER_PAGE) {
        return;
      }

      return lastPage[lastPage.length - 1].id;
    },
    throwOnError: true,
  });
};
