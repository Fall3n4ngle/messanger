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

export default function ConversationDialog({ open, setOpen, children }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create conversation</DialogTitle>
          <DialogDescription>
            Choose conversation name, image and add members
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
