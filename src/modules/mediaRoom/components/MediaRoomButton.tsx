"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui";
import { PhoneCall } from "lucide-react";
import MediaRoom from "./MediaRoom";
import { useState } from "react";

type Props = {
  conversationId: string;
};

export default function MediaRoomButton({ conversationId }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDisconnect = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full"
                aria-label="Join call"
              >
                <PhoneCall size={22} />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Join call</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="top-0 left-0 w-full max-w-full h-full translate-x-0 translate-y-0 rounded-none p-0">
        <MediaRoom
          conversationId={conversationId}
          onDisconected={handleDisconnect}
        />
      </DialogContent>
    </Dialog>
  );
}
