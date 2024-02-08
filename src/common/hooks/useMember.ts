import { useQuery } from "@tanstack/react-query";
import { getUserMember } from "../actions/member/queries";

type Props = {
  conversationId: string;
  clerkId: string;
};

export const useMember = ({ clerkId, conversationId }: Props) => {
  return useQuery({
    queryKey: ["member", conversationId, clerkId],
    queryFn: () => getUserMember({ conversationId, clerkId }),
    enabled: !!conversationId && !!clerkId,
  });
};
