import { getUsers } from "@/common/actions/user/queries";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  query: string | null;
};

const take = 25;

export const useInfiniteUsers = ({ query }: Props) => {
  const getData = async ({ pageParam }: { pageParam?: string }) => {
    const users = await getUsers({
      lastCursor: pageParam,
      query,
      take,
    });

    return users;
  };

  return useInfiniteQuery({
    queryKey: ["users", query],
    queryFn: getData,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < take) {
        return;
      }

      return lastPage[lastPage.length - 1].id;
    },
  });
};
