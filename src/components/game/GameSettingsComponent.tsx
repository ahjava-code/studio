// src/components/game/GameSettingsComponent.tsx
"use client";

// Ensure the import path for GameSettings is correct
import type { GameSettings } from '@/types'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch'; // Import Switch component
import { Settings } from 'lucide-react';
import { useState, useEffect } from 'react'; // Import useState and useEffect

interface GameSettingsProps {
  settings: GameSettings;
  onSettingsChange: (newSettings: Partial<GameSettings>) => void;
  disabled: boolean;
}

const paragraphLengths: GameSettings['paragraphLength'][] = [50, 100, 200, 300];
const gameDurations: GameSettings['gameDuration'][] = [30, 60, 120];

export function GameSettingsComponent({ settings, onSettingsChange, disabled }: GameSettingsProps) {
  // We'll use local state to manage the switches and then call onSettingsChange
  // when the value actually changes, to avoid too many immediate updates.
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);

  // Effect to update local state if parent settings change (e.g., when playing again)
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key: keyof GameSettings, value: any) => {
    // Update local state immediately for UI feedback
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    // Directly pass the change up to the parent component.
    onSettingsChange({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Settings className="mr-2 h-5 w-5" /> Game Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paragraph Length Select */}
          <div>
            <Label htmlFor="paragraphLength" className="text-base">Paragraph Length (words)</Label>
            <Select
              value={localSettings.paragraphLength.toString()}
              onValueChange={(value) => handleSettingChange('paragraphLength', parseInt(value, 10) as GameSettings['paragraphLength'])}
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

          {/* Game Duration Select */}
          <div>
            <Label htmlFor="gameDuration" className="text-base">Game Duration</Label>
            <Select
              value={localSettings.gameDuration.toString()}
              onValueChange={(value) => handleSettingChange('gameDuration', parseInt(value, 10) as GameSettings['gameDuration'])}
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

        {/* Separated Punctuation Switch */}
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="includePunctuation" className="text-base">Include Punctuation</Label>
          <Switch
            id="includePunctuation"
            // !!! IMPORTANT FIX: Use the correct property name here
            checked={localSettings.includePunctuation} 
            onCheckedChange={(checked) => handleSettingChange('includePunctuation', checked)}
            disabled={disabled}
          />
        </div>

        {/* Separated Numbers Switch */}
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="includeNumbers" className="text-base">Include Numbers</Label>
          <Switch
            id="includeNumbers"
            // !!! IMPORTANT FIX: Use the correct property name here
            checked={localSettings.includeNumbers} 
            onCheckedChange={(checked) => handleSettingChange('includeNumbers', checked)}
            disabled={disabled}
          />
        </div>

      </CardContent>
    </Card>
  );
}