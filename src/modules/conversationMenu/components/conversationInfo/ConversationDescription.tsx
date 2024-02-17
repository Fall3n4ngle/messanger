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
      <Avatar className="h-16 w-16">
        {image && <AvatarImage src={image} alt={`${name} image`} />}
        <AvatarFallback className="bg-primary text-lg text-primary-foreground">
          {name[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h4 className="mb-1 scroll-m-20 text-lg font-semibold tracking-tight">
          {name}
        </h4>
        <p className="whitespace-nowrap text-sm text-muted-foreground">
          {membersCount} members
        </p>
      </div>
    </div>
  );
}
