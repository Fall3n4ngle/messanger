import { getUsers } from "@/common/actions/user/queries";

type Props = {
  query: string;
};

export const loadUsers = async ({ query }: Props) => {
  const users = await getUsers({ query });

  return users.map(({ id, name, image }) => ({
    label: name,
    value: id,
    image,
  }));
};
