import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
} & PropsWithChildren;

export default function UserDialog({ open, setOpen, children }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Change your display name or image
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
