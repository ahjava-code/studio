// src/components/game/GameSettingsComponent.tsx
"use client";
import type { GameSettings } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';

interface GameSettingsProps {
  settings: GameSettings;
  onSettingsChange: (newSettings: Partial<GameSettings>) => void;
  disabled: boolean;
}

const paragraphLengths: GameSettings['paragraphLength'][] = [50, 100, 200, 300];
const gameDurations: GameSettings['gameDuration'][] = [30, 60, 120];

export function GameSettingsComponent({ settings, onSettingsChange, disabled }: GameSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Settings className="mr-2 h-5 w-5" /> Game Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="paragraphLength" className="text-base">Paragraph Length (words)</Label>
            <Select
              value={settings.paragraphLength.toString()}
              onValueChange={(value) => onSettingsChange({ paragraphLength: parseInt(value, 10) as GameSettings['paragraphLength'] })}
              disabled={disabled}
            >
              <SelectTrigger id="paragraphLength" className="mt-1 text-base">
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                {paragraphLengths.map(length => (
                  <SelectItem key={length} value={length.toString()} className="text-base">
                    {length} words
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="gameDuration" className="text-base">Game Duration</Label>
            <Select
              value={settings.gameDuration.toString()}
              onValueChange={(value) => onSettingsChange({ gameDuration: parseInt(value, 10) as GameSettings['gameDuration'] })}
              disabled={disabled}
            >
              <SelectTrigger id="gameDuration" className="mt-1 text-base">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {gameDurations.map(duration => (
                  <SelectItem key={duration} value={duration.toString()} className="text-base">
                    {duration} seconds
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
