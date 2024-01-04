import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui";

export const Header = () => {
  return (
    <DialogHeader>
      <DialogTitle>Create group</DialogTitle>
      <DialogDescription>
        Choose group name, image and add other users
      </DialogDescription>
    </DialogHeader>
  );
};
