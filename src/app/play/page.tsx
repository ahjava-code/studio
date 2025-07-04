// src/app/play/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRoomButton } from "@/components/game/CreateRoomButton"; // Assuming you have these
import { JoinRoomForm } from "@/components/game/JoinRoomForm";      // components
import { Separator } from "@/components/ui/separator";               //
import { Gamepad2 } from "lucide-react";

export default function PlayPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-xl bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Gamepad2 className="h-16 w-16 text-indigo-400" />
          </div>
          <CardTitle className="text-4xl font-bold text-white">Type Duel</CardTitle>
          <CardDescription className="text-lg text-gray-400">
            Challenge a friend in a real-time typing race!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* We'll assume you have a CreateRoomButton component that handles navigation */}
          <CreateRoomButton /> 
          <div className="relative flex items-center">
            <Separator className="flex-1 bg-gray-700" />
            <span className="px-4 text-sm text-gray-500 bg-gray-900">OR</span>
            <Separator className="flex-1 bg-gray-700" />
          </div>
          {/* And a JoinRoomForm component */}
          <JoinRoomForm />
        </CardContent>
      </Card>
      <footer className="text-center mt-12 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Type Duel. Built with Next.js.</p>
      </footer>
    </div>
  );
}