import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui";
import UserDialog from "./UserDialog";
import UserForm from "../common/UserForm";

type Props = {
  image: string | null;
  name: string;
  clerkId: string;
};

export default function UserButton({ image, name, clerkId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button aria-label="open profile dialog">
              <Avatar onClick={() => setOpen(true)}>
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
          </TooltipTrigger>
          <TooltipContent side="right">Update profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <UserDialog open={open} setOpen={setOpen}>
        <UserForm clerkId={clerkId} name={name} image={image} />
      </UserDialog>
    </>
  );
}
