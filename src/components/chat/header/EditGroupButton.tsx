import { GroupForm } from "@/components/common";
import { Member } from "@/components/common/GroupForm";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";

type Props = {
  name: string;
  image: string | null;
  members: Member[];
  conversationId: string;
};

export default function EditGroupButton({
  name,
  image,
  members,
  conversationId,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-20 inline-block">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit group</DialogTitle>
          <DialogDescription>
            Change group name, image, add or remove members
          </DialogDescription>
        </DialogHeader>
        <GroupForm
          successMessage="Group updated successfully"
          errorMessage="Failed to update group"
          name={name}
          image={image}
          members={members}
          id={conversationId}
        />
      </DialogContent>
    </Dialog>
  );
}
