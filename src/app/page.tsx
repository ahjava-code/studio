// src/app/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRoomButton } from "@/components/game/CreateRoomButton";
import { JoinRoomForm } from "@/components/game/JoinRoomForm";
import { Separator } from "@/components/ui/separator";
import { Gamepad2 } from "lucide-react";


export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Gamepad2 className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline font-bold">Type Duel</CardTitle>
          <CardDescription className="text-lg">
            Challenge a friend in a real-time typing race!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CreateRoomButton />
          <div className="relative flex items-center">
            <Separator className="flex-1" />
            <span className="px-4 text-sm text-muted-foreground bg-card">OR</span>
            <Separator className="flex-1" />
          </div>
          <JoinRoomForm />
        </CardContent>
      </Card>
      <footer className="text-center mt-12 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Type Duel. Press 'Cmd/Ctrl + B' to toggle sidebar (if applicable).</p>
      </footer>
    </div>
  );
}
