import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui";

type Props = {
  name: string;
  image: string | null;
  isActive: boolean;
};

export default function UserCard({ image, name, isActive }: Props) {
  return (
    <div className="flex items-center gap-5 cursor-pointer p-2 hover:bg-secondary rounded-md transition-colors">
      <div className="relative">
        <Avatar>
          {image && <AvatarImage src={image} alt={`${name} profile image`} />}
          <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-muted-foreground border-2 border-background",
            isActive && "bg-green-400"
          )}
        />
      </div>
      <span className="font-semibold">{name}</span>
    </div>
  );
}
