// src/components/game/RoomInfo.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Link as LinkIcon, Share2, Users, Key, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface RoomInfoProps {
  roomId: string;
}

export function RoomInfo({ roomId }: RoomInfoProps) {
  const { toast } = useToast();
  const [roomUrl, setRoomUrl] = useState("");
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRoomUrl(`${window.location.origin}/room/${roomId}`);
    }
  }, [roomId]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: `${type} Copied!`,
          description: `${text} has been copied to your clipboard.`,
        });

        if (type === "Room ID") {
          setCopiedId(true);
          setTimeout(() => setCopiedId(false), 2000);
        } else {
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2000);
        }
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: `Could not copy ${type}. Please try manually.`,
          variant: "destructive",
        });
      });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my typing race!",
          text: `Join my typing race room using the ID: ${roomId}`,
          url: roomUrl,
        });
      } catch {
        toast({
          title: "Sharing cancelled",
          description: "The share action was cancelled.",
        });
      }
    } else {
      copyToClipboard(roomUrl, "Room Link");
    }
  };

  // helper for the “copied” style
  const copiedBtnClasses = "bg-green-500 text-white hover:bg-green-600";

  return (
    <div className="space-y-4 mt-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        {/* Room ID Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Key className="h-4 w-4" />
            <span>Room ID</span>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                value={roomId}
                readOnly
                aria-label="Room ID"
                className="bg-muted/50 pl-10 font-mono tracking-widest text-lg h-12"
              />
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(roomId, "Room ID")}
              aria-label="Copy Room ID"
              className={`h-12 w-12 ${copiedId ? copiedBtnClasses : ""}`}
            >
              {copiedId ? <Check className="h-5 w-5" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Room URL Section */}
        {/* {roomUrl && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <LinkIcon className="h-4 w-4" />
              <span>Room Link</span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={roomUrl}
                  readOnly
                  aria-label="Room URL"
                  className="bg-muted/50 pl-10 text-sm truncate h-12"
                />
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(roomUrl, "Room Link")}
                aria-label="Copy Room Link"
                className={`h-12 w-12 ${copiedLink ? copiedBtnClasses : ""}`}
              >
                {copiedLink ? <Check className="h-5 w-5" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )} */}

        {/* Share Button */}
        <Button
          onClick={handleShare}
          variant="default"
          className="mt-2 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Room
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2"
      >
        <Users className="h-3 w-3" />
        Share the Room ID or link with a friend to play!
      </motion.p>
    </div>
  );
}
