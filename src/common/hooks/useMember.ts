import { useQuery } from "@tanstack/react-query";
import { getUserMember } from "../actions/member/queries";

type Props = {
  conversationId: string;
};

export const useMember = ({ conversationId }: Props) => {
  return useQuery({
    queryKey: ["member", conversationId],
    queryFn: () => getUserMember({ conversationId }),
    enabled: !!conversationId,
  });
};
