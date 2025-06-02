// src/components/game/JoinRoomForm.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/lib/hooks/useAuth';
import { joinRoomAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';
import { getOrdinal } from '@/lib/utils';


const JoinRoomFormSchema = z.object({
  roomId: z.string().length(6, "Room ID must be 6 characters long.").toUpperCase(),
});

let playerNumber = 1; // Reset or manage this better if multiple joins on same client instance

export function JoinRoomForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof JoinRoomFormSchema>>({
    resolver: zodResolver(JoinRoomFormSchema),
    defaultValues: {
      roomId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof JoinRoomFormSchema>) {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be signed in to join a room.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    const guestPlayerName = `Player ${getOrdinal(playerNumber === 1 ? 2 : 1)}`; // Guest is likely Player 2
    // If this logic is complex, move player number assignment to server or a shared state.

    const result = await joinRoomAction({ roomId: values.roomId, guestId: user.uid, guestName: guestPlayerName });

    if ('success' in result && result.success) {
      toast({
        title: "Joined Room!",
        description: `Successfully joined room ${values.roomId}. Redirecting...`,
      });
      router.push(`/room/${values.roomId}`);
    } else if ('error' in result) {
      toast({
        title: "Error Joining Room",
        description: result.error,
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }
  
  if (authLoading) {
    return <div className="text-center text-muted-foreground">Authenticating user...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="roomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Room Code</FormLabel>
              <FormControl>
                <Input 
                  placeholder="ABC123" 
                  {...field} 
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || !user} className="w-full text-lg py-6">
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <LogIn className="mr-2 h-5 w-5" />
          )}
          Join Game
        </Button>
      </form>
    </Form>
  );
}
