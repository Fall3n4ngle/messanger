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
import { useCallback, useState } from "react";

export default function MediaRoomButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDisconnect = useCallback(() => {
    setIsOpen(false);
  }, []);

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
      <DialogContent className="left-0 top-0 h-full w-full max-w-full translate-x-0 translate-y-0 rounded-none p-0">
        <MediaRoom onDisconected={handleDisconnect} />
      </DialogContent>
    </Dialog>
  );
}
