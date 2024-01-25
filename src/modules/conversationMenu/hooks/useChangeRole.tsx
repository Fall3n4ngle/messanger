import { useState } from "react";
import { AvailableRoles } from "../const";
import { useToast } from "@/common/hooks";
import { useMutation } from "@tanstack/react-query";
import { changeMemberRole } from "../actions/member";
import { ToastMessage } from "@/components";
import { revalidatePathFromClient } from "@/common/actions/revalidatePath";

type Props = {
  defaultRole: AvailableRoles;
  conversationId: string;
};

export const useChangeRole = ({ conversationId, defaultRole }: Props) => {
  const [optimisticRole, setOptimisticRole] = useState(defaultRole);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: changeMemberRole,
    onMutate: ({ role: newRole }) => {
      setOptimisticRole(newRole);

      toast({
        description: (
          <ToastMessage type="success" message="Role changed successfully" />
        ),
      });
    },
    onError: () => {
      setOptimisticRole(defaultRole);

      toast({
        description: (
          <ToastMessage type="error" message="Error updating role" />
        ),
      });
    },
    onSettled: async () => {
      await revalidatePathFromClient(`/conversations/${conversationId}`);
    },
  });

  return { ...mutation, optimisticRole };
};
