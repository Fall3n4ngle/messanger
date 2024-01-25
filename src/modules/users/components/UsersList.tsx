import { Fragment } from "react";
import { useActiveUsers } from "@/common/store";
import UserCardWithDialog from "./UserCardWithDialog";
import { User } from "@/common/actions/user/queries";

type Props = {
  users: User[][];
};

export default function UsersList({ users }: Props) {
  const { usersIds } = useActiveUsers();

  return (
    <ul className="flex flex-col gap-2">
      {users.map((group, id) => (
        <Fragment key={id}>
          {group.map(({ id: userId, clerkId, ...props }) => {
            const isActive = usersIds.includes(clerkId);

            return (
              <li key={userId}>
                <UserCardWithDialog
                  userId={userId}
                  isActive={isActive}
                  {...props}
                />
              </li>
            );
          })}
        </Fragment>
      ))}
    </ul>
  );
}
