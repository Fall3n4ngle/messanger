type Props = {
  id: string;
  name: string;
  usersCount: number;
  image: string | null;
};

export default function ChatHeader({ id, image, name, usersCount }: Props) {
  return <div>Header</div>;
}
