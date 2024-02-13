import { Avatar, AvatarFallback, AvatarImage } from "@/ui";

type Props = {
  name: string;
  image: string | null;
  membersCount: number;
};

export default function ConversationDescription({
  image,
  membersCount,
  name,
}: Props) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-16 h-16">
        {image && <AvatarImage src={image} alt={`${name} image`} />}
        <AvatarFallback className="text-lg bg-primary text-primary-foreground">
          {name[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h4 className="scroll-m-20 text-lg mb-1 font-semibold tracking-tight">
          {name}
        </h4>
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          {membersCount} members
        </p>
      </div>
    </div>
  );
}
