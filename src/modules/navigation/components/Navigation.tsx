"use client";

import { useLinks } from "../hooks/useLinks";
import { useParams } from "next/navigation";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";

type Props = {
  id: string;
  name: string;
  image: string | null;
  clerkId: string;
};

export default function Navigation(props: Props) {
  const isOnConversationPage = !!useParams()?.conversationId;
  const links = useLinks();

  return (
    <>
      <DesktopNavigation links={links} {...props} />
      {!isOnConversationPage && <MobileNavigation links={links} {...props} />}
    </>
  );
}
