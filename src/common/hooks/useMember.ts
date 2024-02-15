import { useQuery } from "@tanstack/react-query";
import { getUserMember } from "../actions/member/queries";
import { memberKeys } from "../const";

type Props = {
  conversationId: string;
};

export const useMember = ({ conversationId }: Props) => {
  return useQuery({
    queryKey: memberKeys.detail(conversationId),
    queryFn: () => getUserMember({ conversationId }),
    throwOnError: true,
  });
};
