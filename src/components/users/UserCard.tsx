import { Avatar, AvatarFallback, AvatarImage } from "../ui";

type Props = {
  name: string;
  image: string | null;
};

export default function UserCard({ image, name }: Props) {
  return (
    <div className="flex items-center gap-5 cursor-pointer p-2 hover:bg-secondary rounded-md transition-colors">
      <Avatar className="">
        {image && <AvatarImage src={image} alt={`${name} profile image`} />}
        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="font-semibold">{name}</span>
    </div>
  );
}
