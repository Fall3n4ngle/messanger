import { Member } from "@prisma/client";

export type TMember = Member & {
  user: {
    id: string;
    name: string;
    image: string | null;
    clerkId: string;
  };
};
