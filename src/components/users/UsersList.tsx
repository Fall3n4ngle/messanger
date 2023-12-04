import { UserCard } from "../common";
import { ScrollArea } from "../ui";

type Props = {
  users: {
    id: string;
    name: string;
    image: string | null;
  }[];
};

export default function UsersList({ users }: Props) {
  return (
    <ScrollArea>
      {users.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {users.map(({ id, ...props }) => (
            <li key={id}>
              <UserCard {...props} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="ml-3">No users found</p>
      )}
    </ScrollArea>
  );
}
