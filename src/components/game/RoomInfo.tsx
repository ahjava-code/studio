// src/components/game/RoomInfo.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Link as LinkIcon, Share2 } from 'lucide-react'; // Ensure lucide-react is installed
import { useEffect, useState } from "react";

interface RoomInfoProps {
  roomId: string;
}

export function RoomInfo({ roomId }: RoomInfoProps) {
  const { toast } = useToast();
  const [roomUrl, setRoomUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRoomUrl(`${window.location.origin}/room/${roomId}`);
    }
  }, [roomId]);


  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: `${type} Copied!`,
        description: `${text} has been copied to your clipboard.`,
      });
    }).catch(err => {
      toast({
        title: "Copy Failed",
        description: `Could not copy ${type}. Please try manually.`,
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center space-x-2">
        <Input type="text" value={roomId} readOnly aria-label="Room ID" className="bg-muted text-center font-mono tracking-widest"/>
        <Button variant="outline" size="icon" onClick={() => copyToClipboard(roomId, "Room ID")} aria-label="Copy Room ID">
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      {roomUrl && (
         <div className="flex items-center space-x-2">
          <Input type="text" value={roomUrl} readOnly aria-label="Room URL" className="bg-muted text-sm truncate"/>
          <Button variant="outline" size="icon" onClick={() => copyToClipboard(roomUrl, "Room Link")} aria-label="Copy Room Link">
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
      <p className="text-xs text-center text-muted-foreground">Share the Room ID or link with a friend to play!</p>
    </div>
  );
}
