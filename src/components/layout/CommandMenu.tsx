'use client';

import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { Home, Gamepad2, Type, FileCode, Info,HelpCircle } from 'lucide-react';

// --- ADD THESE IMPORTS ---
import { DialogTitle } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

// Define the type for the props this component will accept
interface CommandMenuProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const CommandMenu = ({ open, setOpen }: CommandMenuProps) => {
    const router = useRouter();

    // Effect to listen for keyboard shortcuts (Cmd+K or Ctrl+K)
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(!open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [open, setOpen]);

    // Function to run when an item is selected
    const runCommand = (command: () => unknown) => {
        setOpen(false);
        command();
    };

    return (
        <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
            {/* --- ADD THE ACCESSIBLE, VISUALLY HIDDEN TITLE HERE --- */}
            <VisuallyHidden>
                <DialogTitle>Command Menu</DialogTitle>
            </VisuallyHidden>

            <Command.Input placeholder="Type a command or search..." />
            <Command.List>
                <Command.Empty>No results found.</Command.Empty>

                <Command.Group heading="Navigation">
                    <Command.Item onSelect={() => runCommand(() => router.push('/'))}>
                        <Home className="mr-2 h-4 w-4" />
                        <span>Home</span>
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push('/play'))}>
                        <Gamepad2 className="mr-2 h-4 w-4" />
                        <span>Play (Lobby)</span>
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push('/typing-test'))}>
                        <Type className="mr-2 h-4 w-4" />
                        <span>Typing Test</span>
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push('/how-to-play'))}>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>How to Play</span>
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push('/about'))}>
                        <Info className="mr-2 h-4 w-4" />
                        <span>About</span>
                    </Command.Item>
                </Command.Group>

                <Command.Group heading="Source">
                    <Command.Item onSelect={() => runCommand(() => window.open('https://github.com/your-repo', '_blank'))}>
                        <FileCode className="mr-2 h-4 w-4" />
                        <span>View Source</span>
                    </Command.Item>
                </Command.Group>

            </Command.List>
        </Command.Dialog>
    );
};