import { Avatar, AvatarFallback, AvatarImage } from "../ui";

type Props = {
  name: string;
  image: string | null;
  lastMessageAt: string;
};

export default function ConversationCard({
  name,
  image,
  lastMessageAt,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-3 cursor-pointer p-2 hover:bg-secondary rounded-md transition-colors">
      <Avatar>
        {image && <AvatarImage src={image} alt={`${name} image`} />}
        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="grow">
        <h4 className="scroll-m-20 font-semibold tracking-tight whitespace-nowrap mb-1">
          {name}
        </h4>
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          Last message content
        </p>
      </div>
      <time
        dateTime={lastMessageAt}
        className="self-start text-sm mt-[0.1rem]  text-muted-foreground"
      >
        {lastMessageAt}
      </time>
    </div>
  );
}
