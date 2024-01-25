import { getUsers } from "@/common/actions/user/queries";

type Props = {
  query: string;
  currentUserClerkId: string;
};

export const loadUsers = async ({ currentUserClerkId, query }: Props) => {
  const users = await getUsers({ query, currentUserClerkId });

  return users.map(({ id, name, image }) => ({
    label: name,
    value: id,
    image,
  }));
};
