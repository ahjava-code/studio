// src/components/game/GameSettingsComponent.tsx
"use client";

import type { GameSettings } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GameSettingsProps {
  settings: GameSettings;
  onSettingsChange: (newSettings: Partial<GameSettings>) => void;
  disabled: boolean;
}

const paragraphLengths: GameSettings['paragraphLength'][] = [50, 100, 200, 300];
const gameDurations: GameSettings['gameDuration'][] = [30, 60, 120];

export function GameSettingsComponent({ settings, onSettingsChange, disabled }: GameSettingsProps) {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key: keyof GameSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    onSettingsChange({ [key]: value });
  };

  return (
    <Card className="w-full max-w-xl mx-auto shadow-lg border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl font-bold tracking-tight">
          <Settings className="mr-3 h-5 w-5" />
          Game Settings
        </CardTitle>
        <CardDescription className="pt-1">
          Adjust the parameters for your typing challenge.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-2">
        {/* --- Test Configuration Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Paragraph Length Select */}
          <div className="space-y-2">
            <Label htmlFor="paragraphLength" className="text-sm font-medium">
              Paragraph Length
            </Label>
            <Select
              value={localSettings.paragraphLength.toString()}
              onValueChange={(value) => handleSettingChange('paragraphLength', parseInt(value, 10) as GameSettings['paragraphLength'])}
              disabled={disabled}
            >
              <SelectTrigger id="paragraphLength" className="w-full">
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                {paragraphLengths.map(length => (
                  <SelectItem key={length} value={length.toString()}>
                    {length} words
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Approximate word count for the text.</p>
          </div>

          {/* Game Duration Select */}
          <div className="space-y-2">
            <Label htmlFor="gameDuration" className="text-sm font-medium">
              Game Duration
            </Label>
            <Select
              value={localSettings.gameDuration.toString()}
              onValueChange={(value) => handleSettingChange('gameDuration', parseInt(value, 10) as GameSettings['gameDuration'])}
              disabled={disabled}
            >
              <SelectTrigger id="gameDuration" className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {gameDurations.map(duration => (
                  <SelectItem key={duration} value={duration.toString()}>
                    {duration} seconds
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Time limit for each round.</p>
          </div>
        </div>
        
        <Separator />

        {/* --- Character Set Section --- */}
        <div className="space-y-3">
          {/* Punctuation Switch */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="includePunctuation" className="font-medium">
                Punctuation
              </Label>
              <p className="text-xs text-muted-foreground">
                Include characters like . , " ? !
              </p>
            </div>
            <Switch
              id="includePunctuation"
              checked={localSettings.includePunctuation}
              onCheckedChange={(checked) => handleSettingChange('includePunctuation', checked)}
              disabled={disabled}
              className="ml-4 data-[state=checked]:bg-gray-200 data-[state=unchecked]:bg-[#54c3e8]"
            />
          </div>

          {/* Numbers Switch */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="includeNumbers" className="font-medium">
                Numbers
              </Label>
              <p className="text-xs text-muted-foreground">
                Include digits 0-9 in the text.
              </p>
            </div>
            <Switch
              id="includeNumbers"
              checked={localSettings.includeNumbers}
              onCheckedChange={(checked) => handleSettingChange('includeNumbers', checked)}
              disabled={disabled}
              className="ml-4 data-[state=checked]:bg-gray-200 data-[state=unchecked]:bg-[#54c3e8]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}