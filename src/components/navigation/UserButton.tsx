import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui";
import { UserForm } from "../common";

type Props = {
  image: string | null;
  name: string;
  clerkId: string;
};

export default function UserButton({ image, name, clerkId }: Props) {
  return (
    <Dialog>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button aria-label="open profile dialog">
                <Avatar>
                  {image && (
                    <AvatarImage
                      src={image}
                      alt="Profile picture"
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">Update profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Change your display name or image
          </DialogDescription>
        </DialogHeader>
        <UserForm clerkId={clerkId} name={name} image={image} />
      </DialogContent>
    </Dialog>
  );
}
