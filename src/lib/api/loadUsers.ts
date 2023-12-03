type User = {
  id: string;
  name: string;
  image: string | null;
};

export const loadUsers = async (query: string) => {
  const response = await fetch(`/api/users?query=${query}`);
  const users: User[] = await response.json();

  return users.map(({ id, name, image }) => ({
    label: name,
    value: id,
    image,
  }));
};
