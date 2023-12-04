import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";

type Props = {
  image: string | null;
  name: string;
  description: string;
};

export default function ConversationHeading({
  description,
  image,
  name,
}: Props) {
  return (
    <div className="flex gap-3 items-center">
      <Avatar>
        {image && <AvatarImage src={image} alt={`${name} image`} />}
        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="scroll-m-20 font-semibold tracking-tight whitespace-nowrap mb-1">
          {name}
        </h4>
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          {description}
        </p>
      </div>
    </div>
  );
}
